import type { Options } from '~/types'
import {
  addTrailingS3Sep,
} from './helpers'

export function createContext(options: Options): Options {
  const basePath = options.basePath ? addTrailingS3Sep(options.basePath) : ''

  return {
    ...options,
    basePath,
  }
}
