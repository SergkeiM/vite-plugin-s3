import type { PutObjectCommandOutput } from '@aws-sdk/client-s3'
import type { ResolvedConfig } from 'vite'
import type { File, Options } from '~/types'
import fs from 'node:fs'

import { resolve } from 'node:path'
import { S3 } from '@aws-sdk/client-s3'

import { mapValues } from 'es-toolkit'
import { lookup } from 'mime-types'

import {
  addSeperatorToPath,
  DEFAULT_UPLOAD_OPTIONS,
  getDirectoryFilesRecursive,
  testRule,
  UPLOAD_IGNORES,
} from '~/helpers'

import { logResult } from '~/log'

export default class Uploader {
  options: Options
  vite: ResolvedConfig
  client: S3
  directory: string

  constructor(options: Options, vite: ResolvedConfig) {
    this.options = options

    this.vite = vite

    this.client = new S3(this.options.clientConfig)

    this.directory = resolve(this.vite.root, (this.options.directory ? this.options.directory : this.vite.build.outDir))
  }

  uploadFile(fileName: string, file: string): Promise<PutObjectCommandOutput> {
    let Key = this.options.basePath + fileName

    const params = mapValues(this.options.uploadOptions, (optionConfig: any) => {
      return typeof optionConfig === 'function' ? optionConfig(fileName, file) : optionConfig
    })

    if (Key[0] === '/')
      Key = Key.substr(1)

    if (params.ContentType === undefined)
      params.ContentType = lookup(fileName) || 'application/octet-stream'

    const Body = fs.createReadStream(file)

    return this.client.putObject({
      Key,
      Body,
      ...DEFAULT_UPLOAD_OPTIONS,
      ...params,
    })
  }

  async uploadFiles(files: File[]): Promise<PutObjectCommandOutput[]> {
    if (this.options.sequentialUploads === true) {
      const uploadResponses: PutObjectCommandOutput[] = []
      for (const file of files) {
        const response = await this.uploadFile(file.name, file.path)
        uploadResponses.push(response)
      }
      return uploadResponses
    }

    const uploadFiles = files.map((file: File) => this.uploadFile(file.name, file.path))
    return await Promise.all(uploadFiles)
  }

  isIgnoredFile(file: string): boolean {
    return UPLOAD_IGNORES.some(ignore => new RegExp(ignore).test(file))
  }

  isIncludeAndNotExclude(file: string): boolean {
    const { include, exclude } = this.options

    const isInclude = include ? testRule(include, file) : true
    const isExclude = exclude ? testRule(exclude, file) : false

    return isInclude && !isExclude
  }

  filterAllowedFiles(files: File[]): File[] {
    return files.reduce((res: File[], file: File) => {
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
