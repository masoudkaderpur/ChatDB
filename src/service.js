import { getOpenAI } from './lib/openai.js' // dynamisch statt import.meta.env
import { SYSTEM_MESSAGE } from './components/store/chat.ts'
import { selectedQuery } from './components/store/state.ts'

export const sendAllMessages = async (chats, schema) => {
  const openai = getOpenAI() // holt Instanz mit aktuellem Key

  const messages = [SYSTEM_MESSAGE(schema), ...chats]

  const response = await openai.chat.completions.create({ model: 'gpt-4o', messages })

  const chatGptMessage = {
    role: response.choices[0].message.role,
    content: response.choices[0].message.content
  }

  const content = chatGptMessage.content.trim().toUpperCase()
  console.log(content.startsWith('SELECT'))
  if (content.startsWith('SELECT')) {
    selectedQuery.value = chatGptMessage.content
  } else {
    console.error('Fehler: Antwort ist kein gültiges SELECT-Statement.')
  }
  return chatGptMessage
}
