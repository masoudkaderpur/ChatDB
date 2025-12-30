import OpenAI from 'openai'
import { ref } from 'vue'

export const apiKey = ref('')

// Zugriff auf dynamischen API-Key
export const getOpenAI = () => {
  if (!apiKey.value) {
    throw new Error('API Key not set')
  }

  return new OpenAI({ apiKey: apiKey.value, dangerouslyAllowBrowser: true })
}
