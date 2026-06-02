import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const commonConfig: UserConfig = {
  dts: true,
  sourcemap: true,
  outDir: 'dist',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  deps: {
    neverBundle: ['recursive-readdir', 'es-toolkit', 'kolorist', '@aws-sdk/client-s3', 'mime-types'],
  },
}

export default defineConfig([
  {
    entry: ['src/index.ts'],
    ...commonConfig,
    platform: 'node',
    name: 'index',
  },
])
