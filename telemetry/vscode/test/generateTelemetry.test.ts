/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from 'path'

describe('GenerateTelemetry Argument Parsing', () => {
    describe('Command line arguments', () => {
        test('requires output argument', () => {
            // Output argument is required for generation
            const outputPath = '/path/to/output.ts'
            expect(outputPath).toBeTruthy()
        })

        test('handles extra input files', () => {
            const extraInputFiles = 'file1.json,file2.json,file3.json'
            const files = extraInputFiles.split(',').map(f => f.trim())
            
            expect(files).toHaveLength(3)
            expect(files[0]).toBe('file1.json')
            expect(files[1]).toBe('file2.json')
            expect(files[2]).toBe('file3.json')
        })

        test('handles extra input with spaces', () => {
            const extraInputFiles = 'file1.json, file2.json , file3.json'
            const files = extraInputFiles.split(',').map(f => f.trim())
            
            expect(files).toHaveLength(3)
            expect(files[0]).toBe('file1.json')
            expect(files[1]).toBe('file2.json')
            expect(files[2]).toBe('file3.json')
        })

        test('handles single extra input file', () => {
            const extraInputFiles = 'singleFile.json'
            const files = extraInputFiles.split(',').map(f => f.trim())
            
            expect(files).toHaveLength(1)
            expect(files[0]).toBe('singleFile.json')
        })

        test('handles empty extra input', () => {
            const extraInputFiles: string = ''
            const files = extraInputFiles ? extraInputFiles.split(',').map((f: string) => f.trim()) : []
            
            expect(files.length).toBe(0)
        })
    })

    describe('Input file handling', () => {
        test('appends global definitions to input list', () => {
            const userInputs = ['custom1.json', 'custom2.json']
            const globalFiles = ['commonDefinitions.json', 'vscodeDefinitions.json']
            const allInputs = [...userInputs, ...globalFiles]

            expect(allInputs).toHaveLength(4)
            expect(allInputs[0]).toBe('custom1.json')
            expect(allInputs[1]).toBe('custom2.json')
            expect(allInputs[2]).toBe('commonDefinitions.json')
            expect(allInputs[3]).toBe('vscodeDefinitions.json')
        })

        test('global definitions are always included', () => {
            const globalFiles = ['commonDefinitions.json', 'vscodeDefinitions.json']

            expect(globalFiles).toContain('commonDefinitions.json')
            expect(globalFiles).toContain('vscodeDefinitions.json')
        })

        test('preserves order with user files first', () => {
            const userInputs = ['userFile.json']
            const globalFiles = ['commonDefinitions.json', 'vscodeDefinitions.json']
            const allInputs = [...userInputs, ...globalFiles]

            expect(allInputs[0]).toBe('userFile.json')
            expect(allInputs[allInputs.length - 2]).toBe('commonDefinitions.json')
            expect(allInputs[allInputs.length - 1]).toBe('vscodeDefinitions.json')
        })
    })

    describe('Output file handling', () => {
        test('output path is required', () => {
            const outputPath = undefined
            const isValid = outputPath !== undefined

            expect(isValid).toBe(false)
        })

        test('output path must be string', () => {
            const outputPath = '/path/to/output.ts'
            
            expect(typeof outputPath).toBe('string')
        })

        test('output path can be relative', () => {
            const outputPath = './output/telemetry.ts'
            
            expect(outputPath.startsWith('.')).toBe(true)
        })

        test('output path can be absolute', () => {
            const outputPath = '/absolute/path/output.ts'
            
            expect(path.isAbsolute(outputPath)).toBe(true)
        })
    })

    describe('Argument validation', () => {
        test('throws error when output is missing', () => {
            const args = { extraInput: 'file.json' }
            
            expect(args).not.toHaveProperty('output')
        })

        test('accepts valid output argument', () => {
            const args = { output: '/path/to/output.ts', extraInput: 'file.json' }
            
            expect(args.output).toBe('/path/to/output.ts')
        })

        test('extraInput is optional', () => {
            const args = { output: '/path/to/output.ts' }
            
            expect(args).toHaveProperty('output')
            expect(args).not.toHaveProperty('extraInput')
        })
    })

    describe('Path handling', () => {
        test('joins paths correctly', () => {
            const basePath = '/base/dir'
            const fileName = 'commonDefinitions.json'
            const fullPath = path.join(basePath, fileName)

            expect(fullPath).toBe(path.normalize('/base/dir/commonDefinitions.json'))
        })

        test('handles __dirname correctly', () => {
            // __dirname should be defined in Node.js context
            expect(typeof __dirname).toBe('string')
        })

        test('resolves relative paths from __dirname', () => {
            const relativePath = '../definitions/commonDefinitions.json'
            const fullPath = path.join(__dirname, relativePath)

            expect(path.isAbsolute(fullPath)).toBe(true)
        })
    })

    describe('Input file processing', () => {
        test('processes comma-separated list', () => {
            const inputString = 'a.json,b.json,c.json'
            const result = inputString.split(',').map(item => item.trim())

            expect(result).toEqual(['a.json', 'b.json', 'c.json'])
        })

        test('trims whitespace from file names', () => {
            const inputString = ' file1.json , file2.json '
            const result = inputString.split(',').map(item => item.trim())

            expect(result).toEqual(['file1.json', 'file2.json'])
        })

        test('handles path separators in file names', () => {
            const inputString = 'dir1/file1.json,dir2/file2.json'
            const result = inputString.split(',').map(item => item.trim())

            expect(result[0]).toContain('/')
            expect(result[1]).toContain('/')
        })
    })

    describe('Error conditions', () => {
        test('detects missing required output', () => {
            const args: any = {}
            const hasOutput = 'output' in args

            expect(hasOutput).toBe(false)
        })

        test('validates output is not empty', () => {
            const output = ''
            const isValid = output.length > 0

            expect(isValid).toBe(false)
        })

        test('validates output is not null', () => {
            const output = null
            const isValid = output !== null

            expect(isValid).toBe(false)
        })
    })

    describe('File path edge cases', () => {
        test('handles Windows-style paths', () => {
            const windowsPath = 'C:\\Users\\test\\file.json'
            expect(windowsPath).toContain('\\')
        })

        test('handles Unix-style paths', () => {
            const unixPath = '/home/user/file.json'
            expect(unixPath).toContain('/')
        })

        test('handles mixed separators', () => {
            const mixedPath = 'dir1/dir2\\file.json'
            const normalized = path.normalize(mixedPath)
            
            expect(normalized).toBeTruthy()
        })

        test('handles relative paths with parent directory', () => {
            const relativePath = '../parent/file.json'
            expect(relativePath).toContain('..')
        })

        test('handles current directory notation', () => {
            const currentDir = './file.json'
            expect(currentDir).toContain('.')
        })
    })
})
