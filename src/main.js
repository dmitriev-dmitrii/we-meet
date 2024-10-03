import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import {createMemoryHistory, createRouter} from "vue-router";
import {routes} from "./router/index.js";

const Router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App).use(Router).mount('#app')
