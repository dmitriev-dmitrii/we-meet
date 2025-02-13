import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv} from 'vite'

// https://vitejs.dev/config/

export default defineConfig(( { command, mode, isSsrBuild, isPreview })=> {

const {VITE_APP_PORT } =    loadEnv(mode, process.cwd());

const  publicPath = mode === "production" ? "/we-meet-frontend/" : "/"

const config = {
    server: {
        port: parseInt(VITE_APP_PORT,10),
    },
    plugins: [],
    resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
    base: publicPath,
}


 return config
})
