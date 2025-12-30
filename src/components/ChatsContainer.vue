<template>
  <q-scroll-area ref="chatsContainer" class="chat-container" style="height: 100%; max-height: 70%">
    <Message
      v-for="(chat, index) in CHATS"
      :content="chat.content"
      :role="chat.role"
      :key="index"
      class="q-mt-md"
    />
  </q-scroll-area>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import Message from './Message.vue'
import { CHATS } from './store/chat'

const chatsContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatsContainer.value) {
      chatsContainer.value.setScrollPosition('vertical', 99999, 300)
    }
  })
}

onMounted(scrollToBottom)
watch(CHATS, scrollToBottom, { deep: true })
</script>

<style scoped>
.chat-container {
  background: rgba(240, 240, 240, 0.85); /* Light frosted background */
  backdrop-filter: blur(20px); /* Frosted glass effect */
  padding: 12px;
}
</style>
