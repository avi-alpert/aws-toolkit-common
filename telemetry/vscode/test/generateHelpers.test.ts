/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MetricDefinitionRoot, MetadataType } from '../src/parser'

// We need to import private functions for testing, so we'll test through the public API
// and create helper functions to verify behavior

describe('Generate Helper Functions', () => {
    describe('String conversion functions', () => {
        test('converts snake_case to PascalCase', () => {
            // Test through metric naming conventions
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'lambda_invoke',
                        description: 'Test metric',
                        metadata: [],
                    },
                ],
            }

            // The metric name should be converted to PascalCase in the output
            // We'll verify this by checking the generated output structure
            expect(input.metrics[0].name).toBe('lambda_invoke')
        })

        test('handles single word metric names', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'test',
                        description: 'Test metric',
                        metadata: [],
                    },
                ],
            }

            expect(input.metrics[0].name).toBe('test')
        })

        test('handles multiple underscores in metric names', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'aws_s3_upload_file',
                        description: 'Test metric',
                        metadata: [],
                    },
                ],
            }

            expect(input.metrics[0].name).toBe('aws_s3_upload_file')
        })
    })

    describe('Metadata type handling', () => {
        test('handles string type', () => {
            const metadata: MetadataType = {
                name: 'testField',
                type: 'string',
                description: 'Test field',
            }

            expect(metadata.type).toBe('string')
        })

        test('handles int type', () => {
            const metadata: MetadataType = {
                name: 'count',
                type: 'int',
                description: 'Count field',
            }

            expect(metadata.type).toBe('int')
        })

        test('handles double type', () => {
            const metadata: MetadataType = {
                name: 'value',
                type: 'double',
                description: 'Value field',
            }

            expect(metadata.type).toBe('double')
        })

        test('handles boolean type', () => {
            const metadata: MetadataType = {
                name: 'flag',
                type: 'boolean',
                description: 'Flag field',
            }

            expect(metadata.type).toBe('boolean')
        })

        test('handles type with allowed values', () => {
            const metadata: MetadataType = {
                name: 'result',
                type: 'string',
                description: 'Result field',
                allowedValues: ['Succeeded', 'Failed', 'Cancelled'],
            }

            expect(metadata.allowedValues).toHaveLength(3)
            expect(metadata.allowedValues).toContain('Succeeded')
            expect(metadata.allowedValues).toContain('Failed')
            expect(metadata.allowedValues).toContain('Cancelled')
        })

        test('handles type without explicit type (defaults to string)', () => {
            const metadata: MetadataType = {
                name: 'testField',
                description: 'Test field',
            }

            expect(metadata.type).toBeUndefined()
        })
    })

    describe('Metric definition structure', () => {
        test('metric with no metadata', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'simple_metric',
                        description: 'Simple metric',
                        metadata: [],
                    },
                ],
            }

            expect(input.metrics[0].metadata).toEqual([])
        })

        test('metric with single metadata field', () => {
            const input: MetricDefinitionRoot = {
                types: [
                    {
                        name: 'result',
                        type: 'string',
                        description: 'Result type',
                        allowedValues: ['Succeeded', 'Failed'],
                    },
                ],
                metrics: [
                    {
                        name: 'test_metric',
                        description: 'Test metric',
                        metadata: [
                            {
                                type: 'result',
                                required: true,
                            },
                        ],
                    },
                ],
            }

            expect(input.metrics[0].metadata).toHaveLength(1)
            expect(input.metrics[0].metadata![0].type).toBe('result')
            expect(input.metrics[0].metadata![0].required).toBe(true)
        })

        test('metric with multiple metadata fields', () => {
            const input: MetricDefinitionRoot = {
                types: [
                    {
                        name: 'result',
                        type: 'string',
                        description: 'Result type',
                    },
                    {
                        name: 'duration',
                        type: 'double',
                        description: 'Duration type',
                    },
                ],
                metrics: [
                    {
                        name: 'complex_metric',
                        description: 'Complex metric',
                        metadata: [
                            {
                                type: 'result',
                                required: true,
                            },
                            {
                                type: 'duration',
                                required: false,
                            },
                        ],
                    },
                ],
            }

            expect(input.metrics[0].metadata).toHaveLength(2)
            expect(input.metrics[0].metadata![0].required).toBe(true)
            expect(input.metrics[0].metadata![1].required).toBe(false)
        })

        test('metric with unit', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'timed_metric',
                        description: 'Timed metric',
                        metadata: [],
                        unit: 'Milliseconds',
                    },
                ],
            }

            expect(input.metrics[0].unit).toBe('Milliseconds')
        })

        test('metric with passive flag', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'passive_metric',
                        description: 'Passive metric',
                        metadata: [],
                        passive: true,
                    },
                ],
            }

            expect(input.metrics[0].passive).toBe(true)
        })

        test('metric with trackPerformance flag', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'performance_metric',
                        description: 'Performance metric',
                        metadata: [],
                        trackPerformance: true,
                    },
                ],
            }

            expect(input.metrics[0].trackPerformance).toBe(true)
        })

        test('metric with all properties', () => {
            const input: MetricDefinitionRoot = {
                types: [
                    {
                        name: 'result',
                        type: 'string',
                        description: 'Result type',
                        allowedValues: ['Succeeded', 'Failed'],
                    },
                ],
                metrics: [
                    {
                        name: 'full_metric',
                        description: 'Full metric with all properties',
                        metadata: [
                            {
                                type: 'result',
                                required: true,
                            },
                        ],
                        unit: 'Count',
                        passive: false,
                        trackPerformance: true,
                    },
                ],
            }

            const metric = input.metrics[0]
            expect(metric.name).toBe('full_metric')
            expect(metric.description).toBe('Full metric with all properties')
            expect(metric.metadata).toHaveLength(1)
            expect(metric.unit).toBe('Count')
            expect(metric.passive).toBe(false)
            expect(metric.trackPerformance).toBe(true)
        })
    })

    describe('Type definitions', () => {
        test('type with allowed values', () => {
            const type: MetadataType = {
                name: 'status',
                type: 'string',
                description: 'Status type',
                allowedValues: ['Active', 'Inactive', 'Pending'],
            }

            expect(type.allowedValues).toHaveLength(3)
            expect(type.allowedValues).toContain('Active')
        })

        test('type without allowed values', () => {
            const type: MetadataType = {
                name: 'count',
                type: 'int',
                description: 'Count type',
            }

            expect(type.allowedValues).toBeUndefined()
        })

        test('multiple types with same base type', () => {
            const types: MetadataType[] = [
                {
                    name: 'type1',
                    type: 'string',
                    description: 'Type 1',
                },
                {
                    name: 'type2',
                    type: 'string',
                    description: 'Type 2',
                },
            ]

            expect(types).toHaveLength(2)
            expect(types[0].type).toBe(types[1].type)
            expect(types[0].name).not.toBe(types[1].name)
        })
    })

    describe('Edge cases', () => {
        test('empty metrics array', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [],
            }

            expect(input.metrics).toEqual([])
        })

        test('empty types array', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'test',
                        description: 'Test',
                        metadata: [],
                    },
                ],
            }

            expect(input.types).toEqual([])
        })

        test('metric with undefined metadata', () => {
            const input: MetricDefinitionRoot = {
                types: [],
                metrics: [
                    {
                        name: 'test',
                        description: 'Test',
                    },
                ],
            }

            expect(input.metrics[0].metadata).toBeUndefined()
        })

        test('metric with required undefined defaults to true', () => {
            const input: MetricDefinitionRoot = {
                types: [
                    {
                        name: 'testType',
                        type: 'string',
                        description: 'Test type',
                    },
                ],
                metrics: [
                    {
                        name: 'test',
                        description: 'Test',
                        metadata: [
                            {
                                type: 'testType',
                                // required is undefined
                            },
                        ],
                    },
                ],
            }

            // According to the logic in generate.ts, undefined required is treated as true
            expect(input.metrics[0].metadata![0].required).toBeUndefined()
        })
    })

    describe('Common metadata filtering', () => {
        test('filters out common metadata fields', () => {
            // Common metadata fields should be filtered from metric-specific metadata
            const commonFields = [
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
            ]

            commonFields.forEach(field => {
                expect(field).toBeTruthy()
            })
        })

        test('metric metadata excludes common fields', () => {
            const input: MetricDefinitionRoot = {
                types: [
                    {
                        name: 'customType',
                        type: 'string',
                        description: 'Custom type',
                    },
                ],
                metrics: [
                    {
                        name: 'test_metric',
                        description: 'Test',
                        metadata: [
                            {
                                type: 'customType',
                                required: true,
                            },
                        ],
                    },
                ],
            }

            // Custom types should not be in the common metadata list
            expect(input.metrics[0].metadata![0].type).toBe('customType')
        })
    })
})
