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
            entry: "src/main.ts",
            name: 'VitePluginS3Storage',
            fileName: 'main',
            formats: ["es", "cjs"]
        },
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('src/main.ts', import.meta.url))
            },
            external: ['@aws-sdk/client-s3', 'recursive-readdir', 'mime-types'],
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
