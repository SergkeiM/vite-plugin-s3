import fs from 'fs'
import { S3 } from 'aws-sdk'
import ProgressBar from 'progress'
import mime from 'mime/lite'

import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'
import merge from 'lodash/merge'

import {
    addSeperatorToPath,
    getDirectoryFilesRecursive,
    UPLOAD_IGNORES,
    DEFAULT_UPLOAD_OPTIONS
} from './helpers'

export default class Uploader {

    constructor(ctx) {

        this.ctx = ctx

        this.client = new S3(ctx.clientOptions)

        this.directory = ctx.directory ? ctx.directory :  `${ctx.vite.root}/${ctx.vite.outDir}`;
    }

    transformBasePath() {
        return Promise.resolve(this.ctx.basePathTransform(this.ctx.basePath))
            .then(addTrailingS3Sep)
            .then(nPath => (this.ctx.basePath = nPath))
    }

    setupProgressBar(uploadFiles) {

        const progressTotal = uploadFiles.reduce((acc, {upload}) => upload.totalBytes + acc, 0)
    
        const progressBar = new ProgressBar('Uploading [:bar] :percent :etas', {
            complete: '>',
            incomplete: '∆',
            total: progressTotal,
        })
    
        var progressValue = 0
    
        uploadFiles.forEach(({upload}) => {
            upload.on('httpUploadProgress', ({loaded}) => {
                progressValue += loaded
    
                progressBar.update(progressValue / progressTotal)
            })
        })
    }

    uploadFile(fileName, file){

        let Key = this.ctx.basePath + fileName
    
        const s3Params = mapValues(this.ctx.upload, (optionConfig) => {
            return isFunction(optionConfig) ? optionConfig(fileName, file) : optionConfig
        })
    
        // avoid noname folders in bucket
        if (Key[0] === '/') Key = Key.substr(1)
    
        if (s3Params.ContentType === undefined){
            s3Params.ContentType = mime.getType(fileName)
        }
        
        const Body = fs.createReadStream(file)

        const upload = this.client.upload(
            merge({Key, Body}, DEFAULT_UPLOAD_OPTIONS, s3Params)
        )
    
        return { 
            upload,
            promise: upload.promise()
        }
    }

    async uploadFiles() {

        await this.transformBasePath()

        const uploadFiles = files.map((file) => uploadFile(file.name, file.path))

        if (this.ctx.progress) {

            this.setupProgressBar(uploadFiles)
        }

        return await Promise.all(uploadFiles.map(({ promise }) => promise))
    }

    isIgnoredFile(file) {
        return UPLOAD_IGNORES.some((ignore) => new RegExp(ignore).test(file))
    }
    
    isIncludeAndNotExclude(file) {
        
        const { include, exclude} = this.ctx
    
        const isInclude = include ? new RegExp(include).test(file) : true
        const isExclude = exclude ? new RegExp(exclude).test(file) : false
    
        return isInclude && !isExclude
    }

    filterAllowedFiles(files) {
        return files.reduce((res, file) => {
            if (this.isIncludeAndNotExclude(file.name) && !this.isIgnoredFile(file.name))

            res.push(file)

            return res
        }, [])
    }

    async apply() {

        const dPath = addSeperatorToPath(this.directory)

        const allFiles = await getDirectoryFilesRecursive(dPath)

        const files = this.filterAllowedFiles(allFiles)

        return await this.uploadFiles(files)

    }
}