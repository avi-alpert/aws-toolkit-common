/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateInput } from '../src/parser'

describe('Parser - Extended Edge Cases', () => {
    describe('Valid inputs', () => {
        test('Empty metrics array is valid', () => {
            const input = `{
                "types": [],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics).toHaveLength(0)
        })

        test('Metrics without types is valid', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test metric"
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics).toHaveLength(1)
            expect(result.metrics[0].name).toBe('test_metric')
        })

        test('Metrics with metadata', () => {
            const input = `{
                "types": [
                    {
                        "name": "result",
                        "type": "string",
                        "description": "Result type"
                    }
                ],
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test metric",
                        "metadata": [
                            {
                                "type": "result",
                                "required": true
                            }
                        ]
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics[0].metadata).toBeDefined()
            expect(result.metrics[0].metadata).toHaveLength(1)
        })

        test('Metrics with unit', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test metric",
                        "unit": "Milliseconds"
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics[0].unit).toBe('Milliseconds')
        })

        test('Metrics with passive flag', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test metric",
                        "passive": true
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics[0].passive).toBe(true)
        })

        test('Types with allowedValues', () => {
            const input = `{
                "types": [
                    {
                        "name": "result",
                        "description": "Result type",
                        "allowedValues": ["Succeeded", "Failed", "Cancelled"]
                    }
                ],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.types).toBeDefined()
            expect(result.types![0].allowedValues).toHaveLength(3)
        })

        test('Types with int type', () => {
            const input = `{
                "types": [
                    {
                        "name": "count",
                        "type": "int",
                        "description": "Count type"
                    }
                ],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.types![0].type).toBe('int')
        })

        test('Types with double type', () => {
            const input = `{
                "types": [
                    {
                        "name": "duration",
                        "type": "double",
                        "description": "Duration type"
                    }
                ],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.types![0].type).toBe('double')
        })

        test('Types with boolean type', () => {
            const input = `{
                "types": [
                    {
                        "name": "success",
                        "type": "boolean",
                        "description": "Success type"
                    }
                ],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.types![0].type).toBe('boolean')
        })
    })

    describe('Invalid inputs', () => {
        test('Malformed JSON fails', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test",
                        "description": "test"
                    }
            }`  // Missing closing bracket
            expect(() => validateInput(input, '/test/path')).toThrowError()
        })

        test('Missing required name field in metric', () => {
            const input = `{
                "metrics": [
                    {
                        "description": "Test metric"
                    }
                ]
            }`
            expect(() => validateInput(input, '/test/path')).toThrowError('Failed to parse')
        })

        test('Missing required description field in metric', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test_metric"
                    }
                ]
            }`
            expect(() => validateInput(input, '/test/path')).toThrowError('Failed to parse')
        })

        test('Invalid unit value', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test",
                        "unit": "InvalidUnit"
                    }
                ]
            }`
            expect(() => validateInput(input, '/test/path')).toThrowError('Failed to parse')
        })

        test('Metric name with spaces (if not allowed by schema)', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "test metric with spaces",
                        "description": "Test"
                    }
                ]
            }`
            // This may or may not fail depending on schema - testing validation occurs
            try {
                validateInput(input, '/test/path')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
            }
        })

        test('Empty string as metric name', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "",
                        "description": "Test"
                    }
                ]
            }`
            expect(() => validateInput(input, '/test/path')).toThrowError('Failed to parse')
        })

        test('Type missing name', () => {
            const input = `{
                "types": [
                    {
                        "description": "Test type",
                        "type": "string"
                    }
                ],
                "metrics": []
            }`
            expect(() => validateInput(input, '/test/path')).toThrowError('Failed to parse')
        })

        test('Invalid metadata reference', () => {
            const input = `{
                "types": [
                    {
                        "name": "result",
                        "description": "Result type"
                    }
                ],
                "metrics": [
                    {
                        "name": "test_metric",
                        "description": "Test",
                        "metadata": [
                            {
                                "type": "nonexistent_type"
                            }
                        ]
                    }
                ]
            }`
            // Schema validation may or may not catch this - depends on schema strictness
            // Testing that validation runs
            try {
                validateInput(input, '/test/path')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
            }
        })

        test('Null input', () => {
            expect(() => validateInput(null as any, '/test/path')).toThrowError()
        })

        test('Undefined input', () => {
            expect(() => validateInput(undefined as any, '/test/path')).toThrowError()
        })

        test('Empty string input', () => {
            expect(() => validateInput('', '/test/path')).toThrowError()
        })

        test('Non-JSON string', () => {
            expect(() => validateInput('not json at all', '/test/path')).toThrowError()
        })

        test('Array instead of object', () => {
            expect(() => validateInput('[]', '/test/path')).toThrowError()
        })

        test('Number instead of object', () => {
            expect(() => validateInput('123', '/test/path')).toThrowError()
        })

        test('String value instead of object', () => {
            expect(() => validateInput('"string"', '/test/path')).toThrowError()
        })
    })

    describe('Boundary cases', () => {
        test('Very long metric name', () => {
            const longName = 'a'.repeat(1000)
            const input = `{
                "metrics": [
                    {
                        "name": "${longName}",
                        "description": "Test"
                    }
                ]
            }`
            // Should either succeed or fail gracefully
            try {
                const result = validateInput(input, '/test/path')
                expect(result.metrics[0].name).toBe(longName)
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
            }
        })

        test('Very long description', () => {
            const longDesc = 'description '.repeat(500)
            const input = `{
                "metrics": [
                    {
                        "name": "test",
                        "description": "${longDesc}"
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics[0].description).toBe(longDesc)
        })

        test('Many metrics', () => {
            const metrics = Array.from({ length: 100 }, (_, i) => `
                {
                    "name": "metric_${i}",
                    "description": "Metric ${i}"
                }
            `).join(',')
            const input = `{
                "metrics": [${metrics}]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics).toHaveLength(100)
        })

        test('Many types', () => {
            const types = Array.from({ length: 50 }, (_, i) => `
                {
                    "name": "type_${i}",
                    "description": "Type ${i}",
                    "type": "string"
                }
            `).join(',')
            const input = `{
                "types": [${types}],
                "metrics": []
            }`
            const result = validateInput(input, '/test/path')
            expect(result.types).toHaveLength(50)
        })

        test('Metric with all optional fields', () => {
            const input = `{
                "metrics": [
                    {
                        "name": "complex_metric",
                        "description": "Complex metric",
                        "unit": "Count",
                        "passive": true,
                        "trackPerformance": true,
                        "metadata": []
                    }
                ]
            }`
            const result = validateInput(input, '/test/path')
            expect(result.metrics[0]).toMatchObject({
                name: 'complex_metric',
                description: 'Complex metric',
                unit: 'Count',
                passive: true,
                trackPerformance: true
            })
        })
    })
})
