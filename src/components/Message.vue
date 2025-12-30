<template>
  <div
    :class="['message', { 'user-message': isUser, 'assistant-message': !isUser }]"
    @click="handleReplay"
  >
    <div class="message-sender">
      {{ isUser ? 'You' : 'AI' }}
    </div>
    <div class="message-content">
      {{ content }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { selectedQuery } from './store/state.ts'

const props = defineProps({
  content: { type: String, required: true },
  role: { type: String, default: 'assistant' }
})

const isUser = computed(() => props.role === 'user')

const isSQLQuery = (text) => {
  return /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s+/i.test(text)
}

const handleReplay = async () => {
  if (!isUser.value && isSQLQuery(props.content)) {
    selectedQuery.value = props.content
  }
}
</script>

<style scoped>
.message {
  padding: 12px;
  margin: 6px;
  border-radius: 12px;
  max-width: 75%;
  display: flex;
  flex-direction: column;
}

.user-message {
  background-color: #f0f0f0;
  margin-left: auto;
  color: black;
  text-align: right;
}

.assistant-message {
  background-color: #f0f0f0;
  margin-right: auto;
  color: black;
}

.message-sender {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #0a84ff;
  cursor: pointer;
}

.message-content {
  word-wrap: break-word;
}
</style>
