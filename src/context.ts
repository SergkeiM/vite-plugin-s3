import {
  addTrailingS3Sep,
} from './helpers'
import type { Options } from '~/types'

export function createContext(options: Options): Options {
  const basePath = options.basePath ? addTrailingS3Sep(options.basePath) : ''

  return {
    ...options,
    basePath,
  }
}
