/* eslint-disable no-console */
import { relative } from 'node:path'
import { cyan, dim } from 'kolorist'

import type { ResolvedConfig } from 'vite'

import { version } from '../package.json'
import type { File } from './types'

export function logResult(files: File[], vite: ResolvedConfig) {
  const { root, logLevel = 'info' } = vite

  if (logLevel === 'silent')
    return

  if (logLevel === 'info') {
    console.info([
      '',
    `${cyan(`S3Plugin v${version}`)}`,
    `✓ ${files.length} files uploaded`,
    ...files.map((p: File) => `${dim(relative(root, p.path))}`),
    ].join('\n'))
  }
}
