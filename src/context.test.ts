import { createContext } from './context'
import { addTrailingS3Sep } from './helpers'
import type { Options } from './types'

jest.mock('./helpers', () => ({
    addTrailingS3Sep: jest.fn((path: string) => `${path}/`)
}))

describe('createContext', () => {
    it('should add trailing separator to basePath if provided', () => {
        const options: Options = { basePath: 'some/path', clientConfig: {}, uploadOptions: { Bucket: 'example-bucket' } }
        const result = createContext(options)
        expect(addTrailingS3Sep).toHaveBeenCalledWith('some/path')
        expect(result.basePath).toBe('some/path/')
    })

    it('should set basePath to empty string if not provided', () => {
        const options: Options = { clientConfig: {}, uploadOptions: { Bucket: 'example-bucket' } }
        const result = createContext(options)
        expect(result.basePath).toBe('')
    })

    it('should preserve other options', () => {
        const options: Options = { basePath: 'some/path', clientConfig: {}, uploadOptions: { Bucket: 'example-bucket' } }
        const result = createContext(options)
        expect(result.uploadOptions.Bucket).toBe('example-bucket')
    })
})