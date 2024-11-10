import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig(( { command, mode, isSsrBuild, isPreview })=> {

const {VITE_APP_PORT } =    loadEnv(mode, process.cwd());

const config = {
    server: {
        port: VITE_APP_PORT,
    },
    plugins: [
    vue(),
    ],
    publicPath: mode === "production" ? "/we-meet-frontend/" : "/",

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}


 return config
})
