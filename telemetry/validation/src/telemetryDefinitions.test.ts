import * as fs from 'fs/promises'
import { TelemetryDefinitions, reorder, validate, loadTelemetryDefinitions, saveTelemetryDefinitions } from './telemetryDefinitions'

jest.mock('fs/promises')

describe('loadTelemetryDefinitions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('successfully loads and parses valid JSON file', async () => {
        const mockData: TelemetryDefinitions = {
            types: [{ name: 'apple' }],
            metrics: [{ name: 'metric1' }]
        }
        const mockJson = JSON.stringify(mockData)
        
        jest.mocked(fs.readFile).mockResolvedValue(mockJson)

        const result = await loadTelemetryDefinitions('/path/to/file.json')

        expect(fs.readFile).toHaveBeenCalledWith('/path/to/file.json', { encoding: 'utf8' })
        expect(result).toEqual(mockData)
    })

    test('loads empty arrays correctly', async () => {
        const mockData: TelemetryDefinitions = {
            types: [],
            metrics: []
        }
        const mockJson = JSON.stringify(mockData)
        
        jest.mocked(fs.readFile).mockResolvedValue(mockJson)

        const result = await loadTelemetryDefinitions('/path/to/file.json')

        expect(result.types).toEqual([])
        expect(result.metrics).toEqual([])
    })

    test('loads complex telemetry definitions with metadata', async () => {
        const mockData: TelemetryDefinitions = {
            types: [{ name: 'type1' }, { name: 'type2' }],
            metrics: [
                { name: 'metric1', metadata: [{ type: 'meta1' }, { type: 'meta2' }] },
                { name: 'metric2' }
            ]
        }
        const mockJson = JSON.stringify(mockData)
        
        jest.mocked(fs.readFile).mockResolvedValue(mockJson)

        const result = await loadTelemetryDefinitions('/path/to/file.json')

        expect(result.metrics).toHaveLength(2)
        expect(result.metrics[0].metadata).toHaveLength(2)
        expect(result.metrics[1].metadata).toBeUndefined()
    })

    test('throws error when file does not exist', async () => {
        const error = new Error('ENOENT: no such file or directory')
        jest.mocked(fs.readFile).mockRejectedValue(error)

        await expect(loadTelemetryDefinitions('/nonexistent/file.json')).rejects.toThrow()
    })

    test('throws error when JSON is invalid', async () => {
        jest.mocked(fs.readFile).mockResolvedValue('{ invalid json }')

        await expect(loadTelemetryDefinitions('/path/to/file.json')).rejects.toThrow()
    })

    test('handles file with special characters in path', async () => {
        const mockData: TelemetryDefinitions = { types: [], metrics: [] }
        jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockData))

        await loadTelemetryDefinitions('/path/with spaces/and-special_chars.json')

        expect(fs.readFile).toHaveBeenCalledWith('/path/with spaces/and-special_chars.json', { encoding: 'utf8' })
    })
})

describe('saveTelemetryDefinitions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('saves telemetry definitions with proper formatting', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'apple' }],
            metrics: [{ name: 'metric1' }]
        }
        
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        await saveTelemetryDefinitions(data, '/path/to/file.json')

        expect(fs.writeFile).toHaveBeenCalledWith(
            '/path/to/file.json',
            JSON.stringify(data, undefined, 4),
            { encoding: 'utf8' }
        )
    })

    test('formats JSON with 4-space indentation', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'type1' }],
            metrics: [{ name: 'metric1' }]
        }
        
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        await saveTelemetryDefinitions(data, '/path/to/file.json')

        const savedContent = jest.mocked(fs.writeFile).mock.calls[0][1] as string
        expect(savedContent).toContain('    ')
        expect(savedContent).toMatch(/\{\n {4}"types"/)
    })

    test('saves empty definitions', async () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }
        
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        await saveTelemetryDefinitions(data, '/path/to/file.json')

        expect(fs.writeFile).toHaveBeenCalled()
        const savedContent = jest.mocked(fs.writeFile).mock.calls[0][1] as string
        expect(JSON.parse(savedContent)).toEqual(data)
    })

    test('saves definitions with metadata', async () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'type1' }],
            metrics: [{ name: 'metric1', metadata: [{ type: 'meta1' }, { type: 'meta2' }] }]
        }
        
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        await saveTelemetryDefinitions(data, '/path/to/file.json')

        const savedContent = jest.mocked(fs.writeFile).mock.calls[0][1] as string
        const parsed = JSON.parse(savedContent)
        expect(parsed.metrics[0].metadata).toHaveLength(2)
    })

    test('throws error when write fails', async () => {
        const data: TelemetryDefinitions = { types: [], metrics: [] }
        const error = new Error('EACCES: permission denied')
        jest.mocked(fs.writeFile).mockRejectedValue(error)

        await expect(saveTelemetryDefinitions(data, '/readonly/file.json')).rejects.toThrow()
    })

    test('handles file path with special characters', async () => {
        const data: TelemetryDefinitions = { types: [], metrics: [] }
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        await saveTelemetryDefinitions(data, '/path/with spaces/file-name_123.json')

        expect(fs.writeFile).toHaveBeenCalledWith(
            '/path/with spaces/file-name_123.json',
            expect.any(String),
            { encoding: 'utf8' }
        )
    })
})

describe('validate', () => {
    test('validation passes with a valid definition', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'apple' }, { name: 'banana' }],
            metrics: [{ name: 'aaa' }, { name: 'ggg', metadata: [{ type: 'giraffe' }, { type: 'zebra' }] }, { name: 'zzz' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation passes with empty arrays', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation passes with only types', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'alpha' }, { name: 'beta' }],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation passes with only metrics', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'metric1' }, { name: 'metric2' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation passes with single element arrays', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'single' }],
            metrics: [{ name: 'one' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation passes with metrics without metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation detects unsorted fields', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'banana' }, { name: 'apple' }],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Telemetry Types are not sorted')
        expect(validations[0]).toContain('Expected: apple')
        expect(validations[0]).toContain('Found: banana')
    })

    test('validation detects unsorted metrics', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'zzz' }, { name: 'aaa' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Telemetry Metrics are not sorted')
        expect(validations[0]).toContain('Expected: aaa')
        expect(validations[0]).toContain('Found: zzz')
    })

    test('validation detects unsorted metric metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'aaa' }, { name: 'zzz', metadata: [{ type: 'zebra' }, { type: 'giraffe' }] }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Telemetry Metric zzz has unsorted metadata')
        expect(validations[0]).toContain('Expected: giraffe')
        expect(validations[0]).toContain('Found: zebra')
    })

    test('validation stops at first unsorted type', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'zebra' }, { name: 'alpha' }, { name: 'beta' }],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Expected: alpha')
        expect(validations[0]).toContain('Found: zebra')
    })

    test('validation stops at first unsorted metric', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'zzz' }, { name: 'aaa' }, { name: 'bbb' }]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Expected: aaa')
    })

    test('validation detects multiple issues across types, metrics, and metadata', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'zebra' }, { name: 'apple' }],
            metrics: [
                { name: 'zzz' },
                { name: 'aaa', metadata: [{ type: 'zebra' }, { type: 'alpha' }] }
            ]
        }

        const validations = validate(data)
        expect(validations.length).toBeGreaterThan(0)
        expect(validations.some(v => v.includes('Types'))).toBe(true)
    })

    test('validation handles case-sensitive sorting', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'Apple' }, { name: 'apple' }],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation handles names with special characters', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'item-1' }, { name: 'item_2' }, { name: 'item3' }],
            metrics: []
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation handles multiple metrics with metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'aaa', metadata: [{ type: 'alpha' }, { type: 'beta' }] },
                { name: 'bbb', metadata: [{ type: 'gamma' }, { type: 'delta' }] }
            ]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('validation detects unsorted metadata in first metric only', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'aaa', metadata: [{ type: 'beta' }, { type: 'alpha' }] },
                { name: 'bbb', metadata: [{ type: 'gamma' }] }
            ]
        }

        const validations = validate(data)
        expect(validations).toHaveLength(1)
        expect(validations[0]).toContain('Metric aaa')
    })

    test('validation with large dataset', () => {
        const types = Array.from({ length: 100 }, (_, i) => ({ name: `type${String(i).padStart(3, '0')}` }))
        const metrics = Array.from({ length: 100 }, (_, i) => ({ name: `metric${String(i).padStart(3, '0')}` }))
        
        const data: TelemetryDefinitions = { types, metrics }

        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })
})

describe('reorder', () => {
    test('reordering passes validation check', () => {
        const data: TelemetryDefinitions = createUnorderedData()

        reorder(data)
        const validations = validate(data)
        expect(validations).toHaveLength(0)
    })

    test('reorder types', () => {
        const data: TelemetryDefinitions = createUnorderedData()

        reorder(data)

        expect(data.types[0].name).toBe('apple')
        expect(data.types[1].name).toBe('banana')
    })

    test('reorder metrics', () => {
        const data: TelemetryDefinitions = createUnorderedData()

        reorder(data)

        expect(data.metrics[0].name).toBe('aaa')
        expect(data.metrics[1].name).toBe('zzz')
    })

    test('reorder metrics metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [{ name: 'aaa', metadata: [{ type: 'zebra' }, { type: 'giraffe' }] }]
        }

        reorder(data)

        expect(data.metrics[0].metadata![0].type).toBe('giraffe')
        expect(data.metrics[0].metadata![1].type).toBe('zebra')
    })

    test('reorder handles empty arrays', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: []
        }

        reorder(data)

        expect(data.types).toEqual([])
        expect(data.metrics).toEqual([])
    })

    test('reorder handles single elements', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'single' }],
            metrics: [{ name: 'one' }]
        }

        reorder(data)

        expect(data.types[0].name).toBe('single')
        expect(data.metrics[0].name).toBe('one')
    })

    test('reorder handles already sorted data', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'apple' }, { name: 'banana' }],
            metrics: [{ name: 'aaa' }, { name: 'zzz' }]
        }

        reorder(data)

        expect(data.types[0].name).toBe('apple')
        expect(data.types[1].name).toBe('banana')
        expect(data.metrics[0].name).toBe('aaa')
        expect(data.metrics[1].name).toBe('zzz')
    })

    test('reorder multiple types correctly', () => {
        const data: TelemetryDefinitions = {
            types: [
                { name: 'zebra' },
                { name: 'apple' },
                { name: 'mango' },
                { name: 'banana' }
            ],
            metrics: []
        }

        reorder(data)

        expect(data.types.map(t => t.name)).toEqual(['apple', 'banana', 'mango', 'zebra'])
    })

    test('reorder multiple metrics correctly', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'metric_z' },
                { name: 'metric_a' },
                { name: 'metric_m' },
                { name: 'metric_b' }
            ]
        }

        reorder(data)

        expect(data.metrics.map(m => m.name)).toEqual(['metric_a', 'metric_b', 'metric_m', 'metric_z'])
    })

    test('reorder metrics without metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'zzz' },
                { name: 'aaa' },
                { name: 'mmm' }
            ]
        }

        reorder(data)

        expect(data.metrics[0].name).toBe('aaa')
        expect(data.metrics[0].metadata).toBeUndefined()
        expect(data.metrics[2].name).toBe('zzz')
    })

    test('reorder only metrics with metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'aaa' },
                { name: 'bbb', metadata: [{ type: 'zebra' }, { type: 'alpha' }] },
                { name: 'ccc' }
            ]
        }

        reorder(data)

        expect(data.metrics[1].metadata![0].type).toBe('alpha')
        expect(data.metrics[1].metadata![1].type).toBe('zebra')
    })

    test('reorder multiple metrics with metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'aaa', metadata: [{ type: 'zeta' }, { type: 'alpha' }] },
                { name: 'bbb', metadata: [{ type: 'omega' }, { type: 'beta' }] }
            ]
        }

        reorder(data)

        expect(data.metrics[0].metadata![0].type).toBe('alpha')
        expect(data.metrics[0].metadata![1].type).toBe('zeta')
        expect(data.metrics[1].metadata![0].type).toBe('beta')
        expect(data.metrics[1].metadata![1].type).toBe('omega')
    })

    test('reorder handles mixed metrics with and without metadata', () => {
        const data: TelemetryDefinitions = {
            types: [],
            metrics: [
                { name: 'zzz', metadata: [{ type: 'omega' }, { type: 'alpha' }] },
                { name: 'aaa' },
                { name: 'mmm', metadata: [{ type: 'zeta' }, { type: 'beta' }] }
            ]
        }

        reorder(data)

        expect(data.metrics[0].name).toBe('aaa')
        expect(data.metrics[0].metadata).toBeUndefined()
        expect(data.metrics[1].name).toBe('mmm')
        expect(data.metrics[1].metadata![0].type).toBe('beta')
        expect(data.metrics[2].name).toBe('zzz')
        expect(data.metrics[2].metadata![0].type).toBe('alpha')
    })

    test('reorder with large dataset', () => {
        const types = Array.from({ length: 100 }, (_, i) => ({ 
            name: `type${String(99 - i).padStart(3, '0')}` 
        }))
        const metrics = Array.from({ length: 100 }, (_, i) => ({ 
            name: `metric${String(99 - i).padStart(3, '0')}` 
        }))
        
        const data: TelemetryDefinitions = { types, metrics }

        reorder(data)

        expect(data.types[0].name).toBe('type000')
        expect(data.types[99].name).toBe('type099')
        expect(data.metrics[0].name).toBe('metric000')
        expect(data.metrics[99].name).toBe('metric099')
    })

    test('reorder preserves case sensitivity', () => {
        const data: TelemetryDefinitions = {
            types: [{ name: 'zebra' }, { name: 'Zebra' }, { name: 'ZEBRA' }],
            metrics: []
        }

        reorder(data)

        expect(data.types[0].name).toBe('ZEBRA')
        expect(data.types[1].name).toBe('Zebra')
        expect(data.types[2].name).toBe('zebra')
    })

    test('reorder handles special characters', () => {
        const data: TelemetryDefinitions = {
            types: [
                { name: 'item_3' },
                { name: 'item-1' },
                { name: 'item.2' }
            ],
            metrics: []
        }

        reorder(data)

        expect(data.types[0].name).toBe('item-1')
        expect(data.types[1].name).toBe('item.2')
        expect(data.types[2].name).toBe('item_3')
    })
})

describe('integration tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('load, validate, reorder, and save workflow', async () => {
        const unsortedData: TelemetryDefinitions = {
            types: [{ name: 'zebra' }, { name: 'apple' }],
            metrics: [{ name: 'zzz' }, { name: 'aaa' }]
        }
        
        jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify(unsortedData))
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        const loaded = await loadTelemetryDefinitions('/path/to/file.json')
        const validations = validate(loaded)
        
        expect(validations.length).toBeGreaterThan(0)
        
        reorder(loaded)
        const validationsAfterReorder = validate(loaded)
        
        expect(validationsAfterReorder).toHaveLength(0)
        
        await saveTelemetryDefinitions(loaded, '/path/to/file.json')
        
        expect(fs.writeFile).toHaveBeenCalled()
    })

    test('load valid data and verify no changes needed', async () => {
        const sortedData: TelemetryDefinitions = {
            types: [{ name: 'apple' }, { name: 'zebra' }],
            metrics: [{ name: 'aaa' }, { name: 'zzz' }]
        }
        
        jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify(sortedData))

        const loaded = await loadTelemetryDefinitions('/path/to/file.json')
        const validations = validate(loaded)
        
        expect(validations).toHaveLength(0)
    })

    test('handles complete workflow with metadata', async () => {
        const unsortedData: TelemetryDefinitions = {
            types: [{ name: 'type2' }, { name: 'type1' }],
            metrics: [
                { name: 'metric2', metadata: [{ type: 'zeta' }, { type: 'alpha' }] },
                { name: 'metric1' }
            ]
        }
        
        jest.mocked(fs.readFile).mockResolvedValue(JSON.stringify(unsortedData))
        jest.mocked(fs.writeFile).mockResolvedValue(undefined)

        const loaded = await loadTelemetryDefinitions('/path/to/file.json')
        reorder(loaded)
        await saveTelemetryDefinitions(loaded, '/path/to/file.json')

        const savedContent = jest.mocked(fs.writeFile).mock.calls[0][1] as string
        const parsed = JSON.parse(savedContent)
        
        expect(parsed.types[0].name).toBe('type1')
        expect(parsed.metrics[0].name).toBe('metric1')
        expect(parsed.metrics[1].metadata[0].type).toBe('alpha')
    })
})

function createUnorderedData(): TelemetryDefinitions {
    const unsortedData: TelemetryDefinitions = {
        types: [{ name: 'banana' }, { name: 'apple' }],
        metrics: [{ name: 'zzz' }, { name: 'aaa' }]
    }

    return unsortedData
}

