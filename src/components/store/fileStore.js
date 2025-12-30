import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', {
  state: () => ({
    fileContent: null
  }),
  actions: {
    setFileContent(content) {
      this.fileContent = content
    },
    clearFileStorage() {
      this.fileContent = null
    }
  }
})
