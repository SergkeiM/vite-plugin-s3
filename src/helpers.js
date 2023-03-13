import path from 'path'
import readDir from 'recursive-readdir'

export const S3_PATH_SEP = '/'
export const PATH_SEP = path.sep

export const DEFAULT_UPLOAD_OPTIONS = {
    ACL: 'public-read'
}

export const UPLOAD_IGNORES = [
    '.DS_Store'
]

export const addTrailingS3Sep = (fPath) => fPath ? fPath.replace(/\/?(\?|#|$)/, '/$1') : fPath

export const addSeperatorToPath = (fPath) => {
    if (!fPath)
        return fPath
  
    return fPath.endsWith(PATH_SEP) ? fPath : fPath + PATH_SEP
}

export const translatePathFromFiles = (rootPath) => {
    return files => {
        return files.map(file => {
            return {
                path: file,
                name: file
                    .replace(rootPath, '')
                    .split(PATH_SEP)
                    .join(S3_PATH_SEP)
            }
        })
    }
}

export const getDirectoryFilesRecursive = (dir, ignores = []) => {
    return new Promise((resolve, reject) => {
        readDir(dir, ignores, (err, files) => err ? reject(err) : resolve(files))
    }).then(translatePathFromFiles(dir))
}