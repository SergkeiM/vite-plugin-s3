import type { PutObjectRequest as PutObject, S3ClientConfig } from '@aws-sdk/client-s3'

declare type PutObjectRequest = Omit<PutObject, 'Body' | 'Key'>

/**
 * Plugin options.
 */
export interface Options {
  /**
   * A Pattern to match for excluded content.
   */
  exclude?: string | RegExp | Function | Array<string | RegExp | Function> | null
  /**
   * A Pattern to match for included content.
   */
  include?: string | RegExp | Function | Array<string | RegExp | Function> | null
  /**
   * Provide the namespace of uploaded files on S3
   */
  basePath?: string | null
  /**
   * Options for upload options of S3ClientConfig
   */
  clientConfig: S3ClientConfig
  /**
   * Provide upload options PutObjectRequest
   */
  uploadOptions: PutObjectRequest
  /**
   * By default: `build.outDir`.
   */
  directory?: string | null
}

/**
 * Files.
 */
export interface File {
  path: string
  name: string
}

export { S3ClientConfig, PutObjectRequest }
