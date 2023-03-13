import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import target from 'vite-plugin-target'

export default defineConfig({
    plugins: [
        target({
            node: {},
        }),
    ],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: "src/main.js",
            name: 'S3VitePlugin',
            fileName: 'main',
            formats: ["es", "cjs"]
        },
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('src/main.js', import.meta.url))
            },
            external: ['aws-sdk', 'progress', 'recursive-readdir', 'mime/lite'],
            output: {
                exports: "named"
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
