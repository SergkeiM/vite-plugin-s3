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
})
