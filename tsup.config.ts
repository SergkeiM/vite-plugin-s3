import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

const commonConfig: Options = {
  clean: true,
  splitting: false,
  dts: true,
  sourcemap: true,
  keepNames: false,
  format: ['esm'],
  outDir: 'dist',
  external: ['recursive-readdir', 'es-toolkit', 'kolorist', '@aws-sdk/client-s3', 'mime-types'],
}

export default defineConfig([
  {
    entry: ['src/index.ts'],
    ...commonConfig,
    platform: 'node',
    name: 'index',
  },
])
