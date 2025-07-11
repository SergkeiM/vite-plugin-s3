/* eslint-disable no-console */
import type { ResolvedConfig } from 'vite'
import type { File } from '~/types'

import { relative } from 'node:path'

import { cyan, dim } from 'kolorist'
import { version } from '../package.json'

export function logResult(files: File[], vite: ResolvedConfig) {
  const { root, logLevel = 'info' } = vite

  if (logLevel === 'silent')
    return

  if (logLevel === 'info') {
    console.info([
      '',
      `${cyan(`ViteS3 v${version}`)}`,
      `✓ ${files.length} files uploaded`,
      ...files.map((p: File) => `${dim(relative(root, p.path))}`),
    ].join('\n'))
  }
}
