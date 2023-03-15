import { relative } from 'path'
import { cyan, dim } from 'kolorist'
import { version } from '../package.json'

export function logResult(files, viteOptions) {

    const { root, logLevel = 'info' } = viteOptions

    if (logLevel === 'silent')
        return

    if (logLevel === 'info') {
        console.info([
        '',
        `${cyan(`S3Plugin v${version}`)}`,
        'files uploaded',
        ...files.map(p => `  ${dim(relative(root, p.path))}`),
        ].join('\n'))
    }
}