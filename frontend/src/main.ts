import adapter from 'webrtc-adapter';
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
console.log(adapter.browserDetails)
app.use(router)

app.mount('#app')
