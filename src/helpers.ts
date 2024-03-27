import path from 'node:path'
import readDir from 'recursive-readdir'
import isRegExp from 'lodash/isRegExp'
import isString from 'lodash/isString'

import type { File, Options } from './types'

export const S3_PATH_SEP = '/'
export const PATH_SEP: string = path.sep

export const DEFAULT_UPLOAD_OPTIONS: object = {
  ACL: 'public-read',
}

export const UPLOAD_IGNORES: string[] = [
  '.DS_Store',
]

export function addTrailingS3Sep(fPath: string): string {
  return fPath ? fPath.replace(/\/?(\?|#|$)/, '/$1') : fPath
}

export function addSeperatorToPath(fPath: string): string {
  if (!fPath)
    return fPath

  return fPath.endsWith(PATH_SEP) ? fPath : fPath + PATH_SEP
}

export function translatePathFromFiles(dir: string, files: string[]): File[] {
  return files.map((file: string): File => ({
    path: file,
    name: file
      .replace(dir, '')
      .split(PATH_SEP)
      .join(S3_PATH_SEP),
  }))
}

export function getDirectoryFilesRecursive(dir: string, ignores: ReadonlyArray<string> = []): Promise<File[]> {
  return new Promise((resolve, reject) => {
    readDir(dir, ignores, (error: Error, files: string[]) => {
      if (error)
        reject(error)

      else
        resolve(translatePathFromFiles(dir, files))
    })
  })
}

export function testRule(rule: Options['include'] | Options['exclude'], subject: string): boolean {
  if (isRegExp(rule))
    return rule.test(subject)
  else if (typeof rule === 'function')
    return !!rule(subject)
  else if (Array.isArray(rule))
    return rule.every((condition: Options['include']) => testRule(condition, subject))
  else if (isString(rule))
    return new RegExp(rule).test(subject)
  else
    throw new Error('Invalid include / exclude rule')
}
