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
        s3Options = {},
        s3UploadOptions = {}
    } = userOptions

    basePath = basePath ? addTrailingS3Sep(basePath) : ''

    return {
        uploadOptions: s3UploadOptions,
        clientOptions: {
            ...s3Options,
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