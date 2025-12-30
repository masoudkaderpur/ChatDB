<template>
  <q-card class="chat-card">
    <div class="row items-center no-wrap">
      <q-icon name="attach_file" size="24px" class="icon-upload" @click="openFileDialog" />
      <q-file
        v-model="file"
        accept=".sql"
        @update:model-value="handleFileChange"
        class="hidden"
        ref="fileInput"
      />
      <q-input
        v-model="message"
        label="How can I help you?"
        filled
        class="chat-input col-grow text-black"
        dense
        @keydown.enter="handleSendMessage"
        label-color="black"
        color="black"
        input-style="color: black;"
      />
      <q-btn flat round icon="send" class="btn-send" @click="handleSendMessage" />
    </div>
    <div class="row justify-end q-mt-md">
      <q-btn flat round icon="refresh" class="btn-reset" @click="resetChat" />
    </div>
  </q-card>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import { sendAllMessages } from '../service.js'
import { CHATS } from './store/chat.ts'
import { useSpeechRecognition } from '@vueuse/core'
import { useFileStore } from './store/fileStore.js'
import { initializeChats } from './store/chat.ts'
import axios from 'axios'
import { useQuasar } from 'quasar'

localStorage.clear()
CHATS.value = null

const $q = useQuasar()
const message = ref('')
const isUserVoiceEnabled = ref(false)
const schema = ref('')

const { isListening, result, start, stop, isSupported } = useSpeechRecognition({
  lang: 'de-DE',
  continuous: true
})

if (isSupported.value) {
  watch(result, (value) => {
    if (isUserVoiceEnabled.value) {
      message.value = value
    }
  })
}

watch(isListening, (value) => {
  if (!value && isUserVoiceEnabled.value) {
    start()
  }
})

watch(isUserVoiceEnabled, (value) => {
  if (value) {
    start()
  } else {
    stop()
  }
})

// Function to send messages
const sendChats = async () => {
  const userMessage = { role: 'user', content: message.value }

  CHATS.value.push(userMessage)

  const chatGPTMessage = await sendAllMessages(CHATS.value, schema.value)
  CHATS.value.push(chatGPTMessage)
}

// Function that sends chats and clears the input field
const handleSendMessage = async () => {
  await sendChats()
  message.value = '' // Clear input after sending
}

const resetChat = async () => {
  CHATS.value.length = 0
}

const fileInput = ref(null)
const fileStore = useFileStore()

const openFileDialog = () => {
  CHATS.value = null
  fileInput.value.$el.click()
}

const getJSON = async () => {
  const response = await axios.get(`http://localhost:3000/database`)
  return response.data.map((item) => JSON.stringify(item)).join(',')
}

const file = ref(null)

const handleFileChange = async (file) => {
  if (!file || !(file instanceof File)) return

  fileStore.clearFileStorage()

  const reader = new FileReader()
  reader.onload = async (e) => {
    const content = e.target.result
    const databaseName = file.name.replace('.sql', '')

    try {
      await sendDatabaseNameToServer(databaseName)
      await new Promise((resolve) => {
        window.electronAPI.uploadSQLFile({ name: file.name, content })
        setTimeout(resolve, 2000)
      })
      const jsoncontent = await getJSON()
      fileStore.setFileContent(jsoncontent)

      if (!schema.value || schema.value.length === 0) {
        console.error('Fehler: Das Schema ist leer oder nicht korrekt geladen.')
      }
      schema.value = jsoncontent
      initializeChats(jsoncontent)

      $q.notify({ type: 'positive', message: 'Datenbank erfolgreich geladen!', timeout: 3000 })
    } catch (error) {
      console.error('Fehler beim Laden der Datenbank:', error)
      $q.notify({ type: 'negative', message: 'Fehler beim Laden der Datenbank.', timeout: 3000 })
    }
  }
  reader.readAsText(file)
}

const sendDatabaseNameToServer = (databaseName) => {
  axios
    .post('http://localhost:3000/databasename', { databaseName })
    .then(() => {})
    .catch((error) => {
      console.error('Error sending database name:', error)
    })
}
</script>

<style scoped>
.chat-card {
  background: rgba(240, 240, 240, 0.85); /* Light version to match theme */
  padding: 12px;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.chat-input {
  background: #f0f0f0;
  border-radius: 8px;
  color: black;
}

.icon-upload {
  color: #0a84ff;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-send {
  background: #0a84ff;
  color: white;
  transition: background 0.3s;
}
.btn-send:hover {
  background: #0071e3;
}

.btn-reset {
  background: rgba(200, 200, 200, 0.3); /* Light gray with transparency */
  color: black;
  transition: background 0.3s;
}

.btn-reset:hover {
  background: rgba(180, 180, 180, 0.6); /* Slightly darker on hover */
}
</style>
