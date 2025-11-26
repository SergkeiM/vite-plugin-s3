import type { CloudFrontClientConfig } from '@aws-sdk/client-cloudfront'
import type { PutObjectRequest as PutObject, S3ClientConfig } from '@aws-sdk/client-s3'

declare type PutObjectRequest = Omit<PutObject, 'Body' | 'Key'>

export type Function = (subject: string) => boolean

export type Pattern = string | RegExp | Function

export type ContentPattern = Pattern | Pattern[] | null

/**
 * CloudFront invalidation options.
 */
export interface CloudFrontOptions {
  /**
   * CloudFront distribution ID
   */
  distributionId: string
  /**
   * Optional CloudFront client configuration. If not provided, uses the same credentials as S3.
   */
  clientConfig?: CloudFrontClientConfig
}

/**
 * Plugin options.
 */
export interface Options {
  /**
   * A Pattern to match for excluded content.
   */
  exclude?: ContentPattern
  /**
   * A Pattern to match for included content.
   */
  include?: ContentPattern
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
  /**
   * If true, files will be uploaded sequentially.
   */
  sequentialUploads?: boolean
  /**
   * CloudFront invalidation options. If provided, creates an invalidation after upload.
   */
  cloudfront?: CloudFrontOptions
}

/**
 * Files.
 */
export interface File {
  path: string
  name: string
}

export { CloudFrontClientConfig, PutObjectRequest, S3ClientConfig }
