<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { apiKey } from '../lib/openai.js'

const router = useRouter()
const localApiKey = ref('') // für das Input

const isFocused = ref(false)

const navigateToApplication = () => {
  if (!localApiKey.value) {
    alert('Bitte API-Key eingeben.')
    return
  }

  apiKey.value = localApiKey.value // setze globalen Key
  router.push('/application')
}
</script>

<template>
  <div class="image-container">
    <div :class="{ 'image-background-blurred': isFocused }" class="image-background"></div>
    <div class="overlay"></div>
    <p class="text text-h4">Enter your API Key and press [Enter]</p>
    <q-input
      filled
      v-model="localApiKey"
      label="API Key"
      class="input-field custom-input"
      label-color="white"
      color="white"
      bg-color="grey-9"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="navigateToApplication"
    />
  </div>
</template>

<style scoped>
.custom-input :deep(.q-field__native) {
  color: white !important;
}

.image-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/Datacenter.jpg');
  background-size: cover;
  background-position: center;
  transition: filter 0.3s ease;
}

.image-background-blurred {
  filter: blur(5px);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

.text {
  font-weight: bold;
  color: white;
  margin-bottom: 40px;
  z-index: 10;
}

.input-field {
  width: 30%;
  margin-bottom: 20px;
  font-size: 18px;
  padding: 12px 16px;
  color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  background-color: #2c2c2e;
}
</style>
