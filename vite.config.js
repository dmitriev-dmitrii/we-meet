import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import legacy from '@vitejs/plugin-legacy'
import webComponentPlugin from "./webComponentPlugin.js";
// https://vitejs.dev/config/

export default defineConfig(( { command, mode, isSsrBuild, isPreview })=> {

const {VITE_APP_PORT } =    loadEnv(mode, process.cwd());

const  publicPath = mode === "production" ? "/we-meet-frontend/" : "/"

 return {
     server: {
         port: parseInt(VITE_APP_PORT, 10),
     },
     plugins: [
         webComponentPlugin(),
         legacy({
             targets: ['defaults','IE 11'],
         }),
     ],
     resolve: {
         alias: {
             '@': fileURLToPath(new URL('./src', import.meta.url))
         }
     },
     base: publicPath,
     build: {
         rollupOptions: {
             output: {
                 manualChunks(id) {
                     if (id.includes('use')) {
                         return 'features';
                     }
                     if (id.includes('components')) {
                         return 'components';
                     }
                 }
             }
         }
     },
 }
})
