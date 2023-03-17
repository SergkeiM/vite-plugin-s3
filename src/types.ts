import type { S3ClientConfig, PutObjectRequest } from "@aws-sdk/client-s3"
import type { ResolvedConfig } from 'vite'


declare type PutObject = Omit<PutObjectRequest, 'Body' | 'Key'> & {};

/**
 * Plugin options.
 */
export interface S3Options {
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

export interface Context {
    options: S3Options;
    vite?: ResolvedConfig 
}