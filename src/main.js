import { createContext } from './context'
import Uploader from './uploader'

const S3Plugin = (enabled = false, options = {}) => {

    const ctx = createContext(options)

    return {
        name: 's3-vite-plugin',
        enforce: 'post',
        apply(config, { command }) {
            return command === 'build' && enabled;
        },
        configResolved (config) {
            ctx.config = config
        },
        closeBundle: {
            async handler() {
                if (!ctx.vite.build.ssr && enabled){

                    const uploader = new Uploader(ctx)

                    await uploader.apply()
                }    
            }
        }
    }
}

export default S3Plugin