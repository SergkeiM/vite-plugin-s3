import { createContext } from './context'
import Uploader from './uploader'

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { S3Options, Context } from './types'

export function S3Plugin(enabled: boolean, options: S3Options): Plugin {

    const ctx: Context = createContext(options)

    return {
        name: 'vite-plugin-s3',
        enforce: 'post',
        apply(config: UserConfig, { command }) {
            return command === 'build' && enabled;
        },
        configResolved (config: ResolvedConfig) {
            ctx.vite = config
        },
        closeBundle: {
            async handler() {
                if (!ctx.vite?.build.ssr && enabled){

                    const uploader = new Uploader(ctx)

                    await uploader.apply()
                }    
            }
        }
    }
}

export type { S3Options as Options }
export default S3Plugin