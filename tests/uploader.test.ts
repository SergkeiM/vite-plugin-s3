import type { ResolvedConfig } from 'vite'
import type { File, Options } from '~/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Uploader from '../src/uploader'

// Mocks
vi.mock('node:fs', () => ({
  default: {
    createReadStream: vi.fn(() => 'mockStream'),
  },
}))

vi.mock('@aws-sdk/client-s3', () => ({
  S3: vi.fn().mockImplementation(() => ({
    putObject: vi.fn(() => Promise.resolve({ ETag: 'mock-etag' })),
  })),
}))

vi.mock('@aws-sdk/client-cloudfront', () => ({
  CloudFront: vi.fn().mockImplementation(() => ({
    send: vi.fn(() => Promise.resolve({ Id: 'mock-invalidation-id' })),
  })),
  CreateInvalidationCommand: vi.fn(),
}))

const mockOptions: Options = {
  clientConfig: {},
  basePath: 'base/',
  directory: 'dist',
  uploadOptions: { Bucket: 'test-bucket', ACL: 'private' },
  include: [(file: string) => file === 'file.txt'],
  exclude: ['file2'],
}
const mockVite: ResolvedConfig = {
  root: '/project',
  build: { outDir: 'dist' },
} as any

describe('uploader', () => {
  let uploader: Uploader

  beforeEach(() => {
    uploader = new Uploader(mockOptions, mockVite)
  })

  it('should initialize with correct directory', () => {
    expect(uploader.directory).toBe('/project/dist')
  })

  it('should filter ignored files', () => {
    expect(uploader.isIgnoredFile('.DS_Store')).toBe(true)
    expect(uploader.isIgnoredFile('file.txt')).toBe(false)
  })

  it('should apply include and exclude rules', () => {
    expect(uploader.isIncludeAndNotExclude('file.txt')).toBe(true)
    expect(uploader.isIncludeAndNotExclude('file1.txt')).toBe(false)
    expect(uploader.isIncludeAndNotExclude('other.js')).toBe(false)
  })

  it('should filter allowed files', () => {
    const files: File[] = [
      { name: 'file.txt', path: '/mock/file.txt' },
      { name: 'file1.txt', path: '/mock/file1.txt' },
      { name: '.DS_Store', path: '/mock/.DS_Store' },
    ]
    const allowed = uploader.filterAllowedFiles(files)
    expect(allowed).toEqual([{ name: 'file.txt', path: '/mock/file.txt' }])
  })

  it('should upload a file with correct params', async () => {
    const result = await uploader.uploadFile('file.txt', '/mock/file.txt')
    expect(result).toHaveProperty('ETag', 'mock-etag')
  })

  it('should upload multiple files', async () => {
    const files: File[] = [
      { name: 'file1.txt', path: '/mock/file1.txt' },
      { name: 'file2.js', path: '/mock/file2.js' },
    ]
    const results = await uploader.uploadFiles(files)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('ETag', 'mock-etag')
  })

  it('should upload multiple files sequentially', async () => {
    const files: File[] = [
      { name: 'file1.txt', path: '/mock/file1.txt' },
      { name: 'file2.js', path: '/mock/file2.js' },
    ]
    uploader.options.disableParallelUploads = true
    const results = await uploader.uploadFiles(files)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('ETag', 'mock-etag')
  })

  it('should initialize CloudFront client when cloudfront option is provided', () => {
    const optionsWithCloudFront: Options = {
      ...mockOptions,
      cloudfront: { distributionId: 'E1234567890ABC' },
    }
    const uploaderWithCF = new Uploader(optionsWithCloudFront, mockVite)
    expect(uploaderWithCF.cloudfront).toBeDefined()
  })

  it('should not initialize CloudFront client when cloudfront option is not provided', () => {
    expect(uploader.cloudfront).toBeUndefined()
  })

  it('should create invalidation for uploaded files', async () => {
    const { CreateInvalidationCommand } = await import('@aws-sdk/client-cloudfront')
    const mockSend = vi.fn(() => Promise.resolve({ Id: 'mock-invalidation-id' }))
    const optionsWithCloudFront: Options = {
      ...mockOptions,
      cloudfront: { distributionId: 'E1234567890ABC' },
    }
    const uploaderWithCF = new Uploader(optionsWithCloudFront, mockVite)
    uploaderWithCF.cloudfront = { send: mockSend } as any

    const files: File[] = [
      { name: 'file1.txt', path: '/mock/file1.txt' },
      { name: 'file2.js', path: '/mock/file2.js' },
    ]

    await uploaderWithCF.createInvalidation(files)

    expect(CreateInvalidationCommand).toHaveBeenCalledWith({
      DistributionId: 'E1234567890ABC',
      InvalidationBatch: {
        CallerReference: expect.stringContaining('vite-plugin-s3-'),
        Paths: {
          Quantity: 2,
          Items: ['/base/file1.txt', '/base/file2.js'],
        },
      },
    })
    expect(mockSend).toHaveBeenCalled()
  })

  it('should not create invalidation when cloudfront is not configured', async () => {
    const files: File[] = [{ name: 'file.txt', path: '/mock/file.txt' }]
    await expect(uploader.createInvalidation(files)).resolves.toBeUndefined()
  })
})
