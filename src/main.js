import './assets/main.css'
import router from './router/index.js'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
