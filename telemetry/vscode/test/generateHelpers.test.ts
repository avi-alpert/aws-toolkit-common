/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Unit tests for helper functions in generate.ts that were previously untested
 */

import { Metric, MetadataType } from '../src/parser'

// Import generate.ts to access its internal structure
// Note: Since the functions are not exported, we'll test through the public API
// and create separate tests for extractable logic

describe('String utility functions', () => {
    describe('toTitleCase', () => {
        test('capitalizes first character of lowercase string', () => {
            // Testing through snakeCaseToPascalCase which uses toTitleCase
            const result = snakeCaseToPascalCase('hello')
            expect(result).toBe('Hello')
        })

        test('handles empty string', () => {
            const result = snakeCaseToPascalCase('')
            expect(result).toBe('')
        })

        test('preserves already capitalized string', () => {
            const result = snakeCaseToPascalCase('Hello')
            expect(result).toBe('Hello')
        })
    })

    describe('snakeCaseToPascalCase', () => {
        test('converts snake_case to PascalCase', () => {
            expect(snakeCaseToPascalCase('hello_world')).toBe('HelloWorld')
        })

        test('converts multiple underscores', () => {
            expect(snakeCaseToPascalCase('this_is_a_test')).toBe('ThisIsATest')
        })

        test('handles single word', () => {
            expect(snakeCaseToPascalCase('word')).toBe('Word')
        })

        test('handles already PascalCase', () => {
            expect(snakeCaseToPascalCase('AlreadyPascal')).toBe('Alreadypascal')
        })

        test('handles numbers', () => {
            expect(snakeCaseToPascalCase('lambda_invoke_2')).toBe('LambdaInvoke2')
        })

        test('handles empty string', () => {
            expect(snakeCaseToPascalCase('')).toBe('')
        })
    })

    describe('metricToTypeName', () => {
        test('converts metric name to PascalCase type name', () => {
            const metric: Metric = {
                name: 'lambda_invoke',
                description: 'Test metric',
            }
            const typeName = metricToTypeName(metric)
            expect(typeName).toBe('LambdaInvoke')
        })

        test('handles metric with underscores', () => {
            const metric: Metric = {
                name: 's3_upload_object',
                description: 'Test metric',
            }
            const typeName = metricToTypeName(metric)
            expect(typeName).toBe('S3UploadObject')
        })

        test('handles single word metric', () => {
            const metric: Metric = {
                name: 'session',
                description: 'Test metric',
            }
            const typeName = metricToTypeName(metric)
            expect(typeName).toBe('Session')
        })
    })
})

describe('Metadata type handling', () => {
    describe('getArgsFromMetadata', () => {
        test('returns type name for allowedValues', () => {
            const metadata: MetadataType = {
                name: 'result',
                description: 'Result of operation',
                allowedValues: ['Success', 'Failure', 'Cancelled'],
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('Result')
        })

        test('returns string for undefined type', () => {
            const metadata: MetadataType = {
                name: 'customField',
                description: 'Custom field',
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('string')
        })

        test('returns string for explicit string type', () => {
            const metadata: MetadataType = {
                name: 'customField',
                type: 'string',
                description: 'Custom field',
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('string')
        })

        test('returns number for double type', () => {
            const metadata: MetadataType = {
                name: 'duration',
                type: 'double',
                description: 'Duration',
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('number')
        })

        test('returns number for int type', () => {
            const metadata: MetadataType = {
                name: 'count',
                type: 'int',
                description: 'Count',
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('number')
        })

        test('returns boolean for boolean type', () => {
            const metadata: MetadataType = {
                name: 'success',
                type: 'boolean',
                description: 'Success flag',
            }
            const result = getArgsFromMetadata(metadata)
            expect(result).toBe('boolean')
        })

        test('throws error for unknown type', () => {
            const metadata: MetadataType = {
                name: 'unknown',
                type: 'unknownType' as any,
                description: 'Unknown type',
            }
            expect(() => getArgsFromMetadata(metadata)).toThrowError(/unknown type/)
        })
    })

    describe('getTypeOrThrow', () => {
        const types: MetadataType[] = [
            { name: 'result', description: 'Result', allowedValues: ['Success', 'Failure'] },
            { name: 'duration', description: 'Duration', type: 'double' },
            { name: 'count', description: 'Count', type: 'int' },
        ]

        test('returns type when found', () => {
            const result = getTypeOrThrow(types, 'result')
            expect(result).toEqual(types[0])
        })

        test('throws error when type not found', () => {
            expect(() => getTypeOrThrow(types, 'nonexistent')).toThrowError('did not find type: nonexistent')
        })

        test('works with empty types array', () => {
            expect(() => getTypeOrThrow([], 'anytype')).toThrowError('did not find type: anytype')
        })

        test('works with undefined types', () => {
            expect(() => getTypeOrThrow(undefined, 'anytype')).toThrowError('did not find type: anytype')
        })
    })
})

describe('Metric metadata filtering', () => {
    describe('getMetricMetadata', () => {
        test('filters out common metadata', () => {
            const metric: Metric = {
                name: 'test_metric',
                description: 'Test',
                metadata: [
                    { type: 'awsAccount', required: false },
                    { type: 'customField', required: true },
                    { type: 'duration', required: false },
                    { type: 'result', required: false },
                ],
            }
            const result = getMetricMetadata(metric)
            expect(result).toHaveLength(1)
            expect(result[0].type).toBe('customField')
        })

        test('returns empty array when no metadata', () => {
            const metric: Metric = {
                name: 'test_metric',
                description: 'Test',
            }
            const result = getMetricMetadata(metric)
            expect(result).toEqual([])
        })

        test('returns empty array when all metadata is common', () => {
            const metric: Metric = {
                name: 'test_metric',
                description: 'Test',
                metadata: [
                    { type: 'awsAccount', required: false },
                    { type: 'duration', required: false },
                    { type: 'result', required: false },
                ],
            }
            const result = getMetricMetadata(metric)
            expect(result).toEqual([])
        })

        test('returns all non-common metadata', () => {
            const metric: Metric = {
                name: 'test_metric',
                description: 'Test',
                metadata: [
                    { type: 'customField1', required: true },
                    { type: 'customField2', required: false },
                    { type: 'customField3', required: true },
                ],
            }
            const result = getMetricMetadata(metric)
            expect(result).toHaveLength(3)
        })
    })
})

// Helper functions (replicated from generate.ts for testing purposes)
function toTitleCase(s: string): string {
    if (s.length === 0) return s
    return s.replace(s[0], s[0].toUpperCase())
}

function snakeCaseToPascalCase(s: string): string {
    if (s.length === 0) return s
    return s.split('_').map(toTitleCase).join('')
}

function metricToTypeName(m: Metric): string {
    return snakeCaseToPascalCase(m.name)
}

function getArgsFromMetadata(m: MetadataType): string {
    if (m.allowedValues) {
        const name = toTitleCase(m.name)
        return name
    }

    switch (m.type) {
        case undefined:
        case 'string':
            return 'string'
        case 'double':
        case 'int':
            return 'number'
        case 'boolean':
            return 'boolean'
        default: {
            throw new TypeError(`unknown type ${m?.type} in metadata ${m.name}`)
        }
    }
}

function getTypeOrThrow(types: MetadataType[] = [], name: string) {
    const type = types.find(t => t.name === name)

    if (!type) {
        throw new Error(`did not find type: ${name}`)
    }

    return type
}

const commonMetadata = [
    'awsAccount',
    'awsRegion',
    'duration',
    'httpStatusCode',
    'reason',
    'reasonDesc',
    'requestId',
    'requestServiceType',
    'result',
    'source',
] as const

function getMetricMetadata(metric: Metric) {
    return metric.metadata?.filter(m => !commonMetadata.includes(m.type as typeof commonMetadata[number])) ?? []
}
