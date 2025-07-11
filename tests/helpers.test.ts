import type { ContentPattern } from '../src/types'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'

import {
  addSeperatorToPath,
  addTrailingS3Sep,
  DEFAULT_UPLOAD_OPTIONS,
  getDirectoryFilesRecursive,
  PATH_SEP,
  S3_PATH_SEP,
  testRule,
  translatePathFromFiles,
  UPLOAD_IGNORES,
} from '../src/helpers'

// Mock recursive-readdir
vi.mock('recursive-readdir', () => ({
  default: (dir: string, ignores: string[], cb: (_: string | null, paths: string[]) => void) => {
    cb(null, [`${dir}${path.sep}file1.txt`, `${dir}${path.sep}file2.txt`])
  },
}))

describe('constants', () => {
  it('s3_PATH_SEP should be "/"', () => {
    expect(S3_PATH_SEP).toBe('/')
  })

  it('pATH_SEP should match node path.sep', () => {
    expect(PATH_SEP).toBe(path.sep)
  })

  it('dEFAULT_UPLOAD_OPTIONS should have ACL', () => {
    expect(DEFAULT_UPLOAD_OPTIONS).toHaveProperty('ACL', 'public-read')
  })

  it('uPLOAD_IGNORES should contain .DS_Store', () => {
    expect(UPLOAD_IGNORES).toContain('.DS_Store')
  })
})

describe('addTrailingS3Sep', () => {
  it('adds trailing slash before query/hash/end', () => {
    expect(addTrailingS3Sep('foo')).toBe('foo/')
    expect(addTrailingS3Sep('foo?bar')).toBe('foo/?bar')
    expect(addTrailingS3Sep('foo#baz')).toBe('foo/#baz')
    expect(addTrailingS3Sep('foo/')).toBe('foo/')
    expect(addTrailingS3Sep('')).toBe('')
  })
})

describe('addSeperatorToPath', () => {
  it('adds path separator if not present', () => {
    expect(addSeperatorToPath(`foo`)).toBe(`foo${PATH_SEP}`)
    expect(addSeperatorToPath(`foo${PATH_SEP}`)).toBe(`foo${PATH_SEP}`)
    expect(addSeperatorToPath('')).toBe('')
  })
})

describe('translatePathFromFiles', () => {
  it('translates file paths to File objects', () => {
    const dir = `/base${PATH_SEP}`
    const files = [`/base${PATH_SEP}foo.txt`, `/base${PATH_SEP}bar/baz.txt`]
    const result = translatePathFromFiles(dir, files)
    expect(result).toEqual([
      { path: `/base${PATH_SEP}foo.txt`, name: `foo.txt` },
      { path: `/base${PATH_SEP}bar/baz.txt`, name: `bar${S3_PATH_SEP}baz.txt` },
    ])
  })
})

describe('getDirectoryFilesRecursive', () => {
  it('returns files recursively', async () => {
    const dir = '/mockdir'
    const files = await getDirectoryFilesRecursive(dir)
    expect(files).toEqual([
      { path: '/mockdir/file1.txt', name: '/file1.txt' },
      { path: '/mockdir/file2.txt', name: '/file2.txt' },
    ])
  })
})

describe('testRule', () => {
  it('handles RegExp', () => {
    expect(testRule(/foo/, 'foobar')).toBe(true)
    expect(testRule(/bar/, 'baz')).toBe(false)
  })

  it('handles function', () => {
    expect(testRule((s: string) => s.startsWith('a'), 'abc')).toBe(true)
    expect(testRule((s: string) => s.startsWith('b'), 'abc')).toBe(false)
  })

  it('handles array of rules', () => {
    const arr: ContentPattern = [/foo/, (s: string) => s.endsWith('bar')]
    expect(testRule(arr, 'foobar')).toBe(true)
    expect(testRule(arr, 'foo')).toBe(false)
  })

  it('handles string as RegExp', () => {
    expect(testRule('foo', 'foobar')).toBe(true)
    expect(testRule('bar', 'baz')).toBe(false)
  })

  it('throws on invalid rule', () => {
    // @ts-expect-error TypeScript should catch this
    expect(() => testRule(123, 'abc')).toThrow('Invalid include / exclude rule')
  })
})
