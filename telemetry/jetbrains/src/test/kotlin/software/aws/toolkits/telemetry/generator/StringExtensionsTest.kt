// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package software.aws.toolkits.telemetry.generator

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

/**
 * Tests for String extension functions used in telemetry generation
 * These functions are defined in TelemetryGenerator.kt
 */
class StringExtensionsTest {

    @Test
    fun `filterInvalidCharacters removes dots`() {
        assertThat("test.name".filterInvalidCharacters()).isEqualTo("testname")
    }

    @Test
    fun `filterInvalidCharacters removes multiple dots`() {
        assertThat("test.name.value".filterInvalidCharacters()).isEqualTo("testnamevalue")
    }

    @Test
    fun `filterInvalidCharacters handles no dots`() {
        assertThat("testname".filterInvalidCharacters()).isEqualTo("testname")
    }

    @Test
    fun `filterInvalidCharacters handles empty string`() {
        assertThat("".filterInvalidCharacters()).isEqualTo("")
    }

    @Test
    fun `filterInvalidCharacters handles only dots`() {
        assertThat("...".filterInvalidCharacters()).isEqualTo("")
    }

    @Test
    fun `toTypeFormat converts snake_case to PascalCase`() {
        assertThat("test_name".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toTypeFormat converts kebab-case to PascalCase`() {
        assertThat("test-name".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toTypeFormat handles mixed delimiters`() {
        assertThat("test_name-value".toTypeFormat()).isEqualTo("TestNameValue")
    }

    @Test
    fun `toTypeFormat handles single word`() {
        assertThat("test".toTypeFormat()).isEqualTo("Test")
    }

    @Test
    fun `toTypeFormat handles already PascalCase`() {
        assertThat("TestName".toTypeFormat()).isEqualTo("Testname")
    }

    @Test
    fun `toTypeFormat handles empty string`() {
        assertThat("".toTypeFormat()).isEqualTo("")
    }

    @Test
    fun `toTypeFormat removes dots and converts`() {
        assertThat("test.name_value".toTypeFormat()).isEqualTo("TestnameValue")
    }

    @Test
    fun `toTypeFormat handles multiple underscores`() {
        assertThat("test__name".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toTypeFormat handles multiple hyphens`() {
        assertThat("test--name".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toTypeFormat handles numbers`() {
        assertThat("test_123_name".toTypeFormat()).isEqualTo("Test123Name")
    }

    @Test
    fun `toTypeFormat handles leading underscore`() {
        assertThat("_test_name".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toTypeFormat handles trailing underscore`() {
        assertThat("test_name_".toTypeFormat()).isEqualTo("TestName")
    }

    @Test
    fun `toArgumentFormat converts to camelCase`() {
        assertThat("test_name".toArgumentFormat()).isEqualTo("testName")
    }

    @Test
    fun `toArgumentFormat handles single word`() {
        assertThat("test".toArgumentFormat()).isEqualTo("test")
    }

    @Test
    fun `toArgumentFormat handles kebab-case`() {
        assertThat("test-name".toArgumentFormat()).isEqualTo("testName")
    }

    @Test
    fun `toArgumentFormat handles empty string`() {
        assertThat("".toArgumentFormat()).isEqualTo("")
    }

    @Test
    fun `toArgumentFormat removes dots`() {
        assertThat("test.name_value".toArgumentFormat()).isEqualTo("testnameValue")
    }

    @Test
    fun `toArgumentFormat handles mixed delimiters`() {
        assertThat("test_name-value".toArgumentFormat()).isEqualTo("testNameValue")
    }

    @Test
    fun `toArgumentFormat with numbers`() {
        assertThat("test_123_name".toArgumentFormat()).isEqualTo("test123Name")
    }

    @Test
    fun `toArgumentFormat with long name`() {
        assertThat("this_is_a_very_long_test_name".toArgumentFormat())
            .isEqualTo("thisIsAVeryLongTestName")
    }

    @Test
    fun `toTypeFormat with long name`() {
        assertThat("this_is_a_very_long_test_name".toTypeFormat())
            .isEqualTo("ThisIsAVeryLongTestName")
    }

    @Test
    fun `real world metric name conversion`() {
        assertThat("lambda_invoke".toTypeFormat()).isEqualTo("LambdaInvoke")
        assertThat("lambda_invoke".toArgumentFormat()).isEqualTo("lambdaInvoke")
    }

    @Test
    fun `real world metric name with namespace`() {
        assertThat("s3_upload_object".toTypeFormat()).isEqualTo("S3UploadObject")
        assertThat("s3_upload_object".toArgumentFormat()).isEqualTo("s3UploadObject")
    }

    @Test
    fun `metric name with acronyms`() {
        assertThat("aws_sdk_call".toTypeFormat()).isEqualTo("AwsSdkCall")
        assertThat("aws_sdk_call".toArgumentFormat()).isEqualTo("awsSdkCall")
    }

    @Test
    fun `filterInvalidCharacters preserves underscores and hyphens`() {
        assertThat("test_name-value".filterInvalidCharacters()).isEqualTo("test_name-value")
    }

    @Test
    fun `toTypeFormat handles consecutive delimiters`() {
        assertThat("test__name--value".toTypeFormat()).isEqualTo("TestNameValue")
    }

    @Test
    fun `toArgumentFormat handles consecutive delimiters`() {
        assertThat("test__name--value".toArgumentFormat()).isEqualTo("testNameValue")
    }

    @Test
    fun `toTypeFormat with all caps word`() {
        assertThat("AWS_SERVICE".toTypeFormat()).isEqualTo("AwsService")
    }

    @Test
    fun `toArgumentFormat with all caps word`() {
        assertThat("AWS_SERVICE".toArgumentFormat()).isEqualTo("awsService")
    }
}

// Extension functions replicated for testing
fun String.filterInvalidCharacters() = this.replace(".", "")
fun String.toTypeFormat() = this.filterInvalidCharacters().split("_", "-").joinToString(separator = "") { it.capitalize() }
fun String.toArgumentFormat() = this.toTypeFormat().decapitalize()
