import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

import webComponentPlugin from "./webComponentPlugin.js";
import path from "path";
// https://vitejs.dev/config/

export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {

    const {VITE_APP_PORT} = loadEnv(mode, process.cwd());

    const isProdMode = mode === 'production'
    const publicPath = isProdMode ? "/we-meet-frontend/" : "/"

    return {
        server: {
            strictPort: true,
            port: parseInt(VITE_APP_PORT, 10),
        },
        preview: {
            strictPort: true,
            port: parseInt(VITE_APP_PORT, 10),
        },
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        base: publicPath,
        // build: {
        //     minify: isProdMode ,
        //     cssMinify: isProdMode,
        //     sourcemap: true,
        //     rollupOptions: {
        //         output: {
        //             chunkFileNames: ({name}) => {
        //                 if (name.includes('.component')) {
        //                     return `components/[name]-[hash].js`;
        //                 }
        //                 return `assets/[name]-[hash].js`;
        //             },
        //             manualChunks(id) {
        //                 if (id.includes('.component')) {
        //                     const fileName = path.basename(id).split('.')[0];
        //                     return `components/${fileName}`; // "component-button.js"
        //                 }
        //             }
        //         }
        //     },
        // },
    }
})
