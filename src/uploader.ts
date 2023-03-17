import type { S3Options, Context } from './types'
import type { ResolvedConfig } from 'vite'
import type { Client } from "@aws-sdk/client-s3"

import fs from 'node:fs'
import { S3 } from '@aws-sdk/client-s3'
import { lookup } from 'mime-types'

import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'

import { logResult } from './log'

import {
    addSeperatorToPath,
    getDirectoryFilesRecursive,
    UPLOAD_IGNORES,
    DEFAULT_UPLOAD_OPTIONS
} from './helpers'

export default class Uploader {

    constructor(ctx: Context) {

        this.options: S3Options = ctx.options

        this.vite: ResolvedConfig = ctx.vite

        this.client: Client = new S3(this.options.clientConfig)

        this.directory = this.options.directory ? this.options.directory : `${this.vite.root}/${this.vite.build.outDir}`;
    }

    uploadFile(fileName, file){

        let Key = this.options.basePath + fileName
    
        const params = mapValues(this.options.uploadOptions, (optionConfig) => {
            return isFunction(optionConfig) ? optionConfig(fileName, file) : optionConfig
        })

        if (Key[0] === '/') Key = Key.substr(1)
    
        if (params.ContentType === undefined){
            params.ContentType = lookup(fileName) || 'application/octet-stream'
        }
        
        const Body = fs.createReadStream(file)

        return this.client.putObject({
            Key,
            Body,
            ...DEFAULT_UPLOAD_OPTIONS,
            ...params
        })
    }

    async uploadFiles(files) {

        const uploadFiles = files.map((file) => this.uploadFile(file.name, file.path))

        return await Promise.all(uploadFiles)
    }

    isIgnoredFile(file) {
        return UPLOAD_IGNORES.some((ignore) => new RegExp(ignore).test(file))
    }
    
    isIncludeAndNotExclude(file) {
        
        const { include, exclude} = this.options
    
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

        await this.uploadFiles(files)

        logResult(files, this.vite)

    }
}