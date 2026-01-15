// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package software.aws.toolkits.telemetry.generator

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test

class ResourceLoaderTest {
    @Test
    fun schemaFileIsLoaded() {
        // Act
        val schemaContent = ResourceLoader.SCHEMA_FILE

        // Assert
        assertThat(schemaContent).isNotNull
        assertThat(schemaContent).isNotEmpty
        assertThat(schemaContent).contains("\"\$schema\"")
    }

    @Test
    fun schemaFileContainsExpectedStructure() {
        // Act
        val schemaContent = ResourceLoader.SCHEMA_FILE

        // Assert - Schema should contain key fields
        assertThat(schemaContent).contains("properties")
        assertThat(schemaContent).contains("types")
        assertThat(schemaContent).contains("metrics")
    }

    @Test
    fun definitionsFilesAreLoaded() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert
        assertThat(definitionsFiles).isNotNull
        assertThat(definitionsFiles).isNotEmpty
    }

    @Test
    fun definitionsFilesContainValidJson() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Each definition file should be valid JSON
        definitionsFiles.forEach { content ->
            assertThat(content).isNotNull
            assertThat(content).isNotEmpty
            assertThat(content.trim()).startsWith("{")
            assertThat(content.trim()).endsWith("}")
        }
    }

    @Test
    fun definitionsFilesContainMetrics() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Each definition file should contain metrics
        definitionsFiles.forEach { content ->
            assertThat(content).contains("\"metrics\"")
        }
    }

    @Test
    fun definitionsFilesContainTypes() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Each definition file should contain types
        definitionsFiles.forEach { content ->
            assertThat(content).contains("\"types\"")
        }
    }

    @Test
    fun schemaFileIsValidJson() {
        // Act
        val schemaContent = ResourceLoader.SCHEMA_FILE

        // Assert
        assertThat(schemaContent.trim()).startsWith("{")
        assertThat(schemaContent.trim()).endsWith("}")
    }

    @Test
    fun definitionsFilesCountMatchesExpected() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Based on the code, we expect at least one definition file
        assertThat(definitionsFiles).hasSize(1)
    }

    @Test
    fun commonDefinitionsFileIsPresent() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - The commonDefinitions.json should be loaded
        assertThat(definitionsFiles).isNotEmpty
        val firstDefinition = definitionsFiles[0]
        assertThat(firstDefinition).isNotNull
        assertThat(firstDefinition).isNotEmpty
    }

    @Test
    fun schemaContainsJsonSchemaVersion() {
        // Act
        val schemaContent = ResourceLoader.SCHEMA_FILE

        // Assert - JSON Schema should have $schema property
        assertThat(schemaContent).contains("\"\$schema\"")
        assertThat(schemaContent).contains("http://json-schema.org")
    }

    @Test
    fun definitionsContainMetricDefinitions() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Definitions should have structure for metrics
        definitionsFiles.forEach { content ->
            assertThat(content).contains("\"metrics\"")
            assertThat(content).contains("[")
        }
    }

    @Test
    fun definitionsContainTypeDefinitions() {
        // Act
        val definitionsFiles = ResourceLoader.DEFINITIONS_FILES

        // Assert - Definitions should have structure for types
        definitionsFiles.forEach { content ->
            assertThat(content).contains("\"types\"")
            assertThat(content).contains("[")
        }
    }
}
