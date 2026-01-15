import { loadTelemetryDefinitions, saveTelemetryDefinitions, TelemetryDefinitions } from './telemetryDefinitions'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'

describe('loadTelemetryDefinitions', () => {
    let tempDir: string
    let tempFile: string

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telemetry-test-'))
        tempFile = path.join(tempDir, 'test-definitions.json')
    })

    afterEach(async () => {
        try {
            await fs.rm(tempDir, { recursive: true, force: true })
        } catch (e) {
            // Ignore cleanup errors
        }
    })

    test('loads valid telemetry definitions', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'result' }],
            metrics: [{ name: 'test_metric' }]
        }
        await fs.writeFile(tempFile, JSON.stringify(data), 'utf8')

        const result = await loadTelemetryDefinitions(tempFile)

        expect(result.types).toHaveLength(1)
        expect(result.types[0].name).toBe('result')
        expect(result.metrics).toHaveLength(1)
        expect(result.metrics[0].name).toBe('test_metric')
    })

    test('loads definitions with metadata', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'result' }],
            metrics: [
                { 
                    name: 'test_metric',
                    metadata: [
                        { type: 'result' },
                        { type: 'duration' }
                    ]
                }
            ]
        }
        await fs.writeFile(tempFile, JSON.stringify(data), 'utf8')

        const result = await loadTelemetryDefinitions(tempFile)

        expect(result.metrics[0].metadata).toHaveLength(2)
        expect(result.metrics[0].metadata![0].type).toBe('result')
        expect(result.metrics[0].metadata![1].type).toBe('duration')
    })

    test('throws error for non-existent file', async () => {
        await expect(loadTelemetryDefinitions('/non/existent/file.json')).rejects.toThrow()
    })

    test('throws error for invalid JSON', async () => {
        await fs.writeFile(tempFile, 'not valid json{', 'utf8')

        await expect(loadTelemetryDefinitions(tempFile)).rejects.toThrow()
    })

    test('loads empty arrays', async () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }
        await fs.writeFile(tempFile, JSON.stringify(data), 'utf8')

        const result = await loadTelemetryDefinitions(tempFile)

        expect(result.types).toHaveLength(0)
        expect(result.metrics).toHaveLength(0)
    })
})

describe('saveTelemetryDefinitions', () => {
    let tempDir: string
    let tempFile: string

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telemetry-test-'))
        tempFile = path.join(tempDir, 'test-definitions.json')
    })

    afterEach(async () => {
        try {
            await fs.rm(tempDir, { recursive: true, force: true })
        } catch (e) {
            // Ignore cleanup errors
        }
    })

    test('saves telemetry definitions with proper formatting', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'result' }],
            metrics: [{ name: 'test_metric' }]
        }

        await saveTelemetryDefinitions(data, tempFile)

        const fileContent = await fs.readFile(tempFile, 'utf8')
        const parsed = JSON.parse(fileContent)

        expect(parsed.types).toHaveLength(1)
        expect(parsed.metrics).toHaveLength(1)
        // Check formatting (should have 4-space indentation)
        expect(fileContent).toContain('    ')
    })

    test('saves definitions with metadata', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'result' }],
            metrics: [
                { 
                    name: 'test_metric',
                    metadata: [
                        { type: 'result' },
                        { type: 'duration' }
                    ]
                }
            ]
        }

        await saveTelemetryDefinitions(data, tempFile)

        const fileContent = await fs.readFile(tempFile, 'utf8')
        const parsed = JSON.parse(fileContent)

        expect(parsed.metrics[0].metadata).toHaveLength(2)
    })

    test('overwrites existing file', async () => {
        const data1: TelemetryDefinitions = {
            types: [{ name: 'type1' }],
            metrics: []
        }
        const data2: TelemetryDefinitions = {
            types: [{ name: 'type2' }],
            metrics: []
        }

        await saveTelemetryDefinitions(data1, tempFile)
        await saveTelemetryDefinitions(data2, tempFile)

        const result = await loadTelemetryDefinitions(tempFile)
        expect(result.types[0].name).toBe('type2')
    })

    test('creates file in non-existent directory', async () => {
        const nestedPath = path.join(tempDir, 'nested', 'path', 'file.json')
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }

        // This should fail because parent directories don't exist
        await expect(saveTelemetryDefinitions(data, nestedPath)).rejects.toThrow()
    })

    test('saves empty definitions', async () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }

        await saveTelemetryDefinitions(data, tempFile)

        const result = await loadTelemetryDefinitions(tempFile)
        expect(result.types).toHaveLength(0)
        expect(result.metrics).toHaveLength(0)
    })
})

describe('loadTelemetryDefinitions and saveTelemetryDefinitions round-trip', () => {
    let tempDir: string
    let tempFile: string

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telemetry-test-'))
        tempFile = path.join(tempDir, 'test-definitions.json')
    })

    afterEach(async () => {
        try {
            await fs.rm(tempDir, { recursive: true, force: true })
        } catch (e) {
            // Ignore cleanup errors
        }
    })

    test('preserves data through save and load cycle', async () => {
        const originalData: TelemetryDefinitions = {
            types: [
                { name: 'result' },
                { name: 'source' }
            ],
            metrics: [
                { 
                    name: 'metric1',
                    metadata: [{ type: 'result' }]
                },
                { 
                    name: 'metric2',
                    metadata: [{ type: 'source' }]
                }
            ]
        }

        await saveTelemetryDefinitions(originalData, tempFile)
        const loadedData = await loadTelemetryDefinitions(tempFile)

        expect(loadedData).toEqual(originalData)
    })

    test('preserves complex nested structures', async () => {
        const originalData: TelemetryDefinitions = {
            types: [
                { name: 'type1' },
                { name: 'type2' },
                { name: 'type3' }
            ],
            metrics: [
                { 
                    name: 'complex_metric',
                    metadata: [
                        { type: 'type1' },
                        { type: 'type2' },
                        { type: 'type3' }
                    ]
                }
            ]
        }

        await saveTelemetryDefinitions(originalData, tempFile)
        const loadedData = await loadTelemetryDefinitions(tempFile)

        expect(loadedData.metrics[0].metadata).toHaveLength(3)
        expect(loadedData).toEqual(originalData)
    })
})
