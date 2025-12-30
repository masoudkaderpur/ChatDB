import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs'
import pg_pkg from 'pg'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import log from 'electron-log'
import eu_pkg from 'electron-updater';

const { autoUpdater } = eu_pkg;
const { Client } = pg_pkg
dotenv.config()

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App startet...')

const { VITE_PG_HOST, VITE_PG_PORT, VITE_PG_USER, VITE_PG_PASSWORD } = process.env

const dbConfig = {
  host: VITE_PG_HOST,
  port: VITE_PG_PORT,
  user: VITE_PG_USER,
  password: VITE_PG_PASSWORD,
}

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let uploadedDatabases = []
let mainWindow

const server = express()
server.use(cors())
server.use(express.json())

server.get('/database', async (req, res) => {
  const client = new Client(dbConfig)

  try {
    await client.connect()

    const result = await client.query(`
      SELECT
          t.table_name,
          json_build_object(
              'columns', (
                  SELECT json_object_agg(c.column_name, c.data_type)
                  FROM (
                      SELECT DISTINCT column_name, data_type
                      FROM information_schema.columns
                      WHERE table_name = t.table_name
                  ) c
              ),
              'foreign_keys', COALESCE((
                  SELECT json_agg(fk)
                  FROM (
                      SELECT DISTINCT ON (kcu.column_name, ccu.table_name, ccu.column_name)
                          json_build_object(
                              'column', kcu.column_name,
                              'foreign_table', ccu.table_name,
                              'foreign_column', ccu.column_name
                          ) AS fk
                      FROM
                          information_schema.table_constraints tc
                      JOIN
                          information_schema.key_column_usage kcu
                          ON tc.constraint_name = kcu.constraint_name
                      JOIN
                          information_schema.constraint_column_usage ccu
                          ON tc.constraint_name = ccu.constraint_name
                      WHERE
                          tc.table_name = t.table_name
                          AND tc.constraint_type = 'FOREIGN KEY'
                  ) subquery
              ), '[]'::json)
          ) AS table_details
      FROM
          information_schema.tables t
      WHERE
          t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
      ORDER BY
          t.table_name;
    `)

    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Fehler beim Abrufen der Datenbankstruktur:', error)
  } finally {
    await client.end()
  }
})

server.post('/databasename', async (req, res) => {
  try {
    const { databaseName } = req.body

    if (!databaseName) {
      return res.status(400).json({ error: 'Kein Datenbankname angegeben' })
    }

    process.env.PGDATABASE = databaseName

    res.status(200).json({ message: `Datenbank erfolgreich auf ${databaseName} gesetzt` })
  } catch (error) {
    console.error('Fehler beim Setzen des Datenbanknamens:', error)
    res.status(500).json({ error: 'Serverfehler beim Setzen des Datenbanknamens' })
  }
})

server.get('/table', async (req, res) => {
  const client = new Client(dbConfig)

  try {
    await client.connect()

    const { statement } = req.query

    if (!statement) {
      return res.status(400).json({ error: 'Kein SQL-Statement angegeben' })
    }

    const { rows } = await client.query(statement)

    res.status(200).json(rows)
  } catch (error) {
    console.error('Fehler beim Abrufen der Tabelle:', error)
    res.status(500).json({ error: 'Fehler beim Abrufen der Tabelle' })
  } finally {
    await client.end()
  }
})

// Test-Route für den Server
server.get('/test', (req, res) => {
  res.json({ message: 'Server läuft innerhalb von Electron!' })
})

const startServer = () => {
  const PORT = 3000
  server.listen(PORT)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !!process.env.DEV,
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION
        )
      )
    }
  })
  process.env.DEV ? mainWindow.loadURL(process.env.APP_URL) : mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  startServer()
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('upload-sql-file', async (event, file) => {
  const userDataPath = app.getPath('userData')
  const tempFolder = path.join(userDataPath, 'temp')
  const filePath = path.join(tempFolder, file.name)

  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder)

  try {
    fs.writeFileSync(filePath, file.content)
  } catch (error) {
    console.error('Error writing SQL file to temporary directory:', error)
  }
  const dbName = path.basename(file.name, '.sql')
  uploadedDatabases.push(dbName)
  const client = new Client({
    ...dbConfig
  })

  try {
    await client.connect()
    const dbExistsRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
    );
    const dbExists = dbExistsRes.rowCount > 0;

    if (dbExists) {
      console.log(`Database "${dbName}" already exists. Skipping import.`);
      return;
    }
    else {
      await client.query(`CREATE DATABASE "${dbName}"`)
      console.log('DB created successfully')
      let restoreSQL = fs.readFileSync(filePath, 'utf8')
      restoreSQL = cleanSQLContent(restoreSQL)
      const restoreClient = new Client({
        ...dbConfig,
        database: dbName
      })

      try {
        await restoreClient.connect()
        await restoreClient.query(restoreSQL)
        console.log('DB imported successfully')
      } catch (error) {
        console.error(`Error during import: ${error}`)
      } finally {
        await restoreClient.end()
      }
    }

  } catch (error) {
    console.error('Error during creating DB:', error)
  } finally {
    await client.end()
  }


})

autoUpdater.on('update-available', () => {
  log.info('Update verfügbar, wird heruntergeladen...')
})

autoUpdater.on('error', (error) => {
  log.error('Fehler beim Update:', error)
})

autoUpdater.on('download-progress', (progress) => {
  log.info(`Download-Fortschritt: ${progress.percent}%`)
})

autoUpdater.on('update-downloaded', () => {
  log.info('Update heruntergeladen, wird installiert...')
  autoUpdater.quitAndInstall()
})

function cleanSQLContent(sqlContent) {
  return sqlContent
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) => line && !line.startsWith('--') && !line.startsWith('/*') && !line.endsWith('*/')
    )
    .join(' ')
    .replace(/\\\./g, '')
}
