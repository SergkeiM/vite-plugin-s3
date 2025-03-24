import { addTrailingS3Sep, addSeperatorToPath, translatePathFromFiles, getDirectoryFilesRecursive, testRule, PATH_SEP } from './helpers';
import readDir from 'recursive-readdir';

jest.mock('recursive-readdir');

describe('helpers', () => {
    describe('addTrailingS3Sep', () => {
        it('should add trailing S3 separator', () => {
            expect(addTrailingS3Sep('path/to/file')).toBe('path/to/file/');
            expect(addTrailingS3Sep('path/to/file/')).toBe('path/to/file/');
            expect(addTrailingS3Sep('')).toBe('');
        });
    });

    describe('addSeperatorToPath', () => {
        it('should add separator to path', () => {
            expect(addSeperatorToPath(`path${PATH_SEP}to${PATH_SEP}file`)).toBe(`path${PATH_SEP}to${PATH_SEP}file${PATH_SEP}`);
            expect(addSeperatorToPath(`path${PATH_SEP}to${PATH_SEP}file${PATH_SEP}`)).toBe(`path${PATH_SEP}to${PATH_SEP}file${PATH_SEP}`);
            expect(addSeperatorToPath('')).toBe('');
        });
    });

    describe('translatePathFromFiles', () => {
        it('should translate paths from files', () => {
            const dir = `path${PATH_SEP}to${PATH_SEP}`;
            const files = [`path${PATH_SEP}to${PATH_SEP}file1`, `path${PATH_SEP}to${PATH_SEP}file2`];
            const result = translatePathFromFiles(dir, files);
            expect(result).toEqual([
                { path: `path${PATH_SEP}to${PATH_SEP}file1`, name: `file1` },
                { path: `path${PATH_SEP}to${PATH_SEP}file2`, name: `file2` },
            ]);
        });
    });

    describe('getDirectoryFilesRecursive', () => {
        it('should get directory files recursively', async () => {
            const dir = 'path/to/dir';
            const files = ['file1', 'file2'];
            (readDir as jest.Mock).mockImplementation((dir, ignores, callback) => {
                callback(null, files);
            });

            const result = await getDirectoryFilesRecursive(dir);
            expect(result).toEqual([
                { path: 'file1', name: 'file1' },
                { path: 'file2', name: 'file2' },
            ]);
        });

        it('should handle errors', async () => {
            const dir = 'path/to/dir';
            const error = new Error('Test error');
            (readDir as jest.Mock).mockImplementation((dir, ignores, callback) => {
                callback(error, null);
            });

            await expect(getDirectoryFilesRecursive(dir)).rejects.toThrow('Test error');
        });
    });

    describe('testRule', () => {
        it('should test rule with RegExp', () => {
            const rule = /test/;
            expect(testRule(rule, 'test')).toBe(true);
            expect(testRule(rule, 'notest')).toBe(false);
        });

        it('should test rule with function', () => {
            const rule = (subject: string) => subject === 'test';
            expect(testRule(rule, 'test')).toBe(true);
            expect(testRule(rule, 'notest')).toBe(false);
        });

        it('should test rule with array', () => {
            const rule = [/test/, (subject: string) => subject.length === 4];
            expect(testRule(rule, 'test')).toBe(true);
            expect(testRule(rule, 'notest')).toBe(false);
        });

        it('should test rule with string', () => {
            const rule = 'test';
            expect(testRule(rule, 'test')).toBe(true);
            expect(testRule(rule, 'notest')).toBe(false);
        });

        it('should throw error for invalid rule', () => {
            expect(() => testRule(123 as any, 'test')).toThrow('Invalid include / exclude rule');
        });
    });
});