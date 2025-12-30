import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  uploadSQLFile: (file) => ipcRenderer.send('upload-sql-file', file),
})
