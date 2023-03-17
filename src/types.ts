import type { PutObjectRequest, S3ClientConfig } from '@aws-sdk/client-s3'

declare type PutObject = Omit<PutObjectRequest, 'Body' | 'Key'> & {}

/**
 * Plugin options.
 */
export interface Options {
  /**
   * A Pattern to match for excluded content.
   */
  exclude?: string | null
  /**
   * A Pattern to match for included content.
   */
  include?: string | null
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
  uploadOptions: PutObject
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
