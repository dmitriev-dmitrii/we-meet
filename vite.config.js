import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {

    const VITE_APP_DEV_PORT = 3003

    const isProdMode = mode === 'production'
    const publicPath = isProdMode ? "/we-meet/" : "/"

    return {
        server: {
            strictPort: true,
            port: VITE_APP_DEV_PORT,
        },
        preview: {
            strictPort: true,
            port: VITE_APP_DEV_PORT,
        },
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/css/vars.scss" as *;` // глобальные переменные
                }
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
