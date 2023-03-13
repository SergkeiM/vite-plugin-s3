import fs from 'fs'
import { S3 } from '@aws-sdk/client-s3'
import ProgressBar from 'progress'
import mime from 'mime/lite'

import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'

import {
    addSeperatorToPath,
    getDirectoryFilesRecursive,
    UPLOAD_IGNORES,
    DEFAULT_UPLOAD_OPTIONS
} from './helpers'

export default class Uploader {

    constructor(ctx) {

        this.ctx = ctx

        this.client = new S3(ctx.clientConfig)

        this.directory = ctx.directory ? ctx.directory : `${ctx.vite.root}/${ctx.vite.build.outDir}`;
    }

    uploadFile(fileName, file, cb){

        let Key = this.ctx.basePath + fileName
    
        const params = mapValues(this.ctx.uploadOptions, (optionConfig) => {
            return isFunction(optionConfig) ? optionConfig(fileName, file) : optionConfig
        })

        if (Key[0] === '/') Key = Key.substr(1)
    
        if (params.ContentType === undefined){
            params.ContentType = mime.getType(fileName)
        }
        
        const Body = fs.createReadStream(file)

        return this.client.putObject({
            Key,
            Body,
            ...DEFAULT_UPLOAD_OPTIONS,
            ...params
        }, cb)
    }

    async uploadFiles(files) {

        const bar = new ProgressBar('Uploading files to S3 [:bar] :current/:total', {
            complete: '>',
            incomplete: '∆',
            total: files.length
        })

        const uploadFiles = files.map((file) => this.uploadFile(file.name, file.path, (err, data) => {
            if(!err && this.ctx.progress){
                bar.tick()
            }
        }))

        return await Promise.all(uploadFiles)
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