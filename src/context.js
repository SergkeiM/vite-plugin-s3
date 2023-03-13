import {
    addTrailingS3Sep
} from './helpers'

export function createContext(userOptions){

    let {
        basePath = '',
        directory = null,
        include = null,
        exclude = null,
        progress = true,
        clientConfig = {},
        uploadOptions = {}
    } = userOptions

    basePath = basePath ? addTrailingS3Sep(basePath) : ''

    return {
        uploadOptions,
        clientConfig: {
            ...clientConfig,
            maxAsyncS3: 50 
        },
        basePath: basePath,
        directory: directory,
        include: include,
        exclude: exclude,
        progress: progress,
        vite: undefined
    }
}