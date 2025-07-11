import type { ConfigEnv, Plugin, ResolvedConfig, UserConfig } from 'vite'
import { createContext } from '~/context'
import Uploader from '~/uploader'

import type { Options, PutObjectRequest, S3ClientConfig } from '~/types'

export function ViteS3(enabled: boolean, userOptions: Options): Plugin {
  const options: Options = createContext(userOptions)
  let vite: ResolvedConfig

  return {
    name: 'vite-plugin-s3',
    enforce: 'post',
    apply(config: UserConfig, { command }: ConfigEnv) {
      return command === 'build' && enabled
    },
    configResolved(config: ResolvedConfig) {
      vite = config
    },
    closeBundle: {
      async handler() {
        if (!vite.build.ssr && enabled) {
          const uploader = new Uploader(options, vite)

          await uploader.apply()
        }
      },
    },
  }
}

export { ViteS3 as S3Plugin }

export type { Options, S3ClientConfig, PutObjectRequest }
