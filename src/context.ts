import type { Context, S3Options } from './types'

import {
    addTrailingS3Sep
} from './helpers'

export function createContext(options: S3Options): Context
{
    const basePath = options.basePath ? addTrailingS3Sep(options.basePath) : ''

    return {
        options: {
            ...options,
            basePath
        },
        vite: undefined
    }
}