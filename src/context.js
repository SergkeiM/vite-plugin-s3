import {
    addTrailingS3Sep,
    DEFAULT_TRANSFORM
} from './helpers'

export function createContext(userOptions){

    let {
        basePath = "",
        directory = null,
        include = null,
        exclude = null,
        progress = true,
        basePathTransform = DEFAULT_TRANSFORM,
        s3Options = {},
        s3UploadOptions = {}
    } = userOptions

    basePath = basePath ? addTrailingS3Sep(basePath) : ''

    return {
        basePathTransform: basePathTransform,
        uploadOptions: s3UploadOptions,
        clientOptions: {
            ...s3Options,
            maxAsyncS3: 50 
        },
        basePath: path,
        directory: directory,
        include: include,
        exclude: exclude,
        progress: progress,
        vite: undefined
    }
}