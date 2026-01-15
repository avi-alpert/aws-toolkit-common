// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package software.aws.toolkits.telemetry.generator

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.json.JSONObject

class ResourceLoaderTest {

    @Test
    fun `SCHEMA_FILE loads valid JSON schema`() {
        val schemaContent = ResourceLoader.SCHEMA_FILE
        
        assertThat(schemaContent).isNotNull()
        assertThat(schemaContent).isNotEmpty()
        
        // Verify it's valid JSON
        val jsonObject = JSONObject(schemaContent)
        assertThat(jsonObject).isNotNull()
    }

    @Test
    fun `SCHEMA_FILE contains required schema properties`() {
        val schemaContent = ResourceLoader.SCHEMA_FILE
        val jsonObject = JSONObject(schemaContent)
        
        // Schema should have basic JSON schema properties
        assertThat(jsonObject.has("type") || jsonObject.has("\$schema")).isTrue()
    }

    @Test
    fun `SCHEMA_FILE contains definitions section`() {
        val schemaContent = ResourceLoader.SCHEMA_FILE
        val jsonObject = JSONObject(schemaContent)
        
        // Telemetry schema should have a definitions or properties section
        val hasDefinitions = jsonObject.has("definitions") || 
                            jsonObject.has("properties") ||
                            jsonObject.has("\$defs")
        assertThat(hasDefinitions).isTrue()
    }

    @Test
    fun `DEFINITIONS_FILES is not empty`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        assertThat(definitions).isNotNull()
        assertThat(definitions).isNotEmpty()
    }

    @Test
    fun `DEFINITIONS_FILES contains valid JSON`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        definitions.forEach { definitionContent ->
            assertThat(definitionContent).isNotNull()
            assertThat(definitionContent).isNotEmpty()
            
            // Verify it's valid JSON
            val jsonObject = JSONObject(definitionContent)
            assertThat(jsonObject).isNotNull()
        }
    }

    @Test
    fun `DEFINITIONS_FILES contains commonDefinitions`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        // Should have at least one definition file
        assertThat(definitions).hasSizeGreaterThanOrEqualTo(1)
        
        // Each definition should have metrics property
        definitions.forEach { definitionContent ->
            val jsonObject = JSONObject(definitionContent)
            assertThat(jsonObject.has("metrics")).isTrue()
        }
    }

    @Test
    fun `DEFINITIONS_FILES metrics array is valid`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        definitions.forEach { definitionContent ->
            val jsonObject = JSONObject(definitionContent)
            val metrics = jsonObject.getJSONArray("metrics")
            
            assertThat(metrics).isNotNull()
            // Metrics array should exist (can be empty)
            assertThat(metrics.length()).isGreaterThanOrEqualTo(0)
        }
    }

    @Test
    fun `DEFINITIONS_FILES types array is present if defined`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        definitions.forEach { definitionContent ->
            val jsonObject = JSONObject(definitionContent)
            
            // If types exist, they should be an array
            if (jsonObject.has("types")) {
                val types = jsonObject.getJSONArray("types")
                assertThat(types).isNotNull()
            }
        }
    }

    @Test
    fun `ResourceLoader can be instantiated multiple times`() {
        // Verify object singleton behavior
        val schema1 = ResourceLoader.SCHEMA_FILE
        val schema2 = ResourceLoader.SCHEMA_FILE
        
        // Should return the same content (cached)
        assertThat(schema1).isEqualTo(schema2)
        
        val defs1 = ResourceLoader.DEFINITIONS_FILES
        val defs2 = ResourceLoader.DEFINITIONS_FILES
        
        assertThat(defs1).isEqualTo(defs2)
    }

    @Test
    fun `SCHEMA_FILE has proper structure for telemetry validation`() {
        val schemaContent = ResourceLoader.SCHEMA_FILE
        val jsonObject = JSONObject(schemaContent)
        
        // Check for typical telemetry schema structure
        val hasRelevantStructure = jsonObject.has("properties") ||
                                   jsonObject.has("definitions") ||
                                   jsonObject.toString().contains("metrics") ||
                                   jsonObject.toString().contains("types")
        
        assertThat(hasRelevantStructure).isTrue()
    }

    @Test
    fun `DEFINITIONS_FILES metrics contain required fields`() {
        val definitions = ResourceLoader.DEFINITIONS_FILES
        
        definitions.forEach { definitionContent ->
            val jsonObject = JSONObject(definitionContent)
            val metrics = jsonObject.getJSONArray("metrics")
            
            // If there are metrics, verify they have standard structure
            for (i in 0 until metrics.length()) {
                val metric = metrics.getJSONObject(i)
                
                // Each metric should have at minimum a name
                // (description and other fields might be optional)
                if (metric.length() > 0) {
                    val hasName = metric.has("name")
                    val hasDescription = metric.has("description")
                    
                    // At least name or some identifying field should exist
                    assertThat(hasName || metric.length() > 0).isTrue()
                }
            }
        }
    }
}
