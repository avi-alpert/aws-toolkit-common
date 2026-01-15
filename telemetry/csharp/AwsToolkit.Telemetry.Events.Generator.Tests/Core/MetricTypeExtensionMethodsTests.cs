using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Utils;
using System;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class MetricTypeExtensionMethodsTests
    {
        #region IsAliasedType Tests

        [Fact]
        public void IsAliasedType_IntType_ReturnsTrue()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "int",
                description = "Test field"
            };

            Assert.True(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_DoubleType_ReturnsTrue()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "double",
                description = "Test field"
            };

            Assert.True(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_StringType_ReturnsTrue()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "string",
                description = "Test field"
            };

            Assert.True(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_BooleanType_ReturnsTrue()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "boolean",
                description = "Test field"
            };

            Assert.True(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_WithAllowedValues_ReturnsFalse()
        {
            var type = new MetricType
            {
                name = "result",
                type = "string",
                description = "Result field",
                allowedValues = new[] { "Success", "Failure", "Cancelled" }
            };

            Assert.False(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_WithEmptyAllowedValues_ReturnsTrue()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "string",
                description = "Test field",
                allowedValues = new string[] { }
            };

            Assert.True(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_UnknownType_ReturnsFalse()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "unknownType",
                description = "Test field"
            };

            Assert.False(type.IsAliasedType());
        }

        [Fact]
        public void IsAliasedType_NullType_ReturnsFalse()
        {
            var type = new MetricType
            {
                name = "testField",
                type = null,
                description = "Test field"
            };

            Assert.False(type.IsAliasedType());
        }

        #endregion

        #region GetAliasedType Tests

        [Fact]
        public void GetAliasedType_IntType_ReturnsIntType()
        {
            var type = new MetricType
            {
                name = "count",
                type = "int",
                description = "Count field"
            };

            var result = type.GetAliasedType();

            Assert.Equal(typeof(int), result);
        }

        [Fact]
        public void GetAliasedType_DoubleType_ReturnsDoubleType()
        {
            var type = new MetricType
            {
                name = "duration",
                type = "double",
                description = "Duration field"
            };

            var result = type.GetAliasedType();

            Assert.Equal(typeof(double), result);
        }

        [Fact]
        public void GetAliasedType_StringType_ReturnsStringType()
        {
            var type = new MetricType
            {
                name = "message",
                type = "string",
                description = "Message field"
            };

            var result = type.GetAliasedType();

            Assert.Equal(typeof(string), result);
        }

        [Fact]
        public void GetAliasedType_BooleanType_ReturnsBoolType()
        {
            var type = new MetricType
            {
                name = "success",
                type = "boolean",
                description = "Success field"
            };

            var result = type.GetAliasedType();

            Assert.Equal(typeof(bool), result);
        }

        [Fact]
        public void GetAliasedType_WithAllowedValues_ThrowsException()
        {
            var type = new MetricType
            {
                name = "result",
                type = "string",
                description = "Result field",
                allowedValues = new[] { "Success", "Failure" }
            };

            var exception = Assert.Throws<Exception>(() => type.GetAliasedType());
            Assert.Contains("type not aliased", exception.Message);
        }

        [Fact]
        public void GetAliasedType_UnknownType_ThrowsException()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "unknownType",
                description = "Test field"
            };

            var exception = Assert.Throws<Exception>(() => type.GetAliasedType());
            Assert.Contains("type not aliased", exception.Message);
        }

        #endregion

        #region GetGeneratedTypeName Tests

        [Fact]
        public void GetGeneratedTypeName_AliasedIntType_ReturnsPascalCaseInt32()
        {
            var type = new MetricType
            {
                name = "count_value",
                type = "int",
                description = "Count field"
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("Int32", result);
        }

        [Fact]
        public void GetGeneratedTypeName_AliasedDoubleType_ReturnsPascalCaseDouble()
        {
            var type = new MetricType
            {
                name = "duration_ms",
                type = "double",
                description = "Duration field"
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("Double", result);
        }

        [Fact]
        public void GetGeneratedTypeName_AliasedStringType_ReturnsPascalCaseString()
        {
            var type = new MetricType
            {
                name = "error_message",
                type = "string",
                description = "Error message"
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("String", result);
        }

        [Fact]
        public void GetGeneratedTypeName_AliasedBooleanType_ReturnsPascalCaseBoolean()
        {
            var type = new MetricType
            {
                name = "is_success",
                type = "boolean",
                description = "Success flag"
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("Boolean", result);
        }

        [Fact]
        public void GetGeneratedTypeName_NonAliasedType_ReturnsPascalCaseName()
        {
            var type = new MetricType
            {
                name = "custom_result_type",
                type = "string",
                description = "Custom type",
                allowedValues = new[] { "Success", "Failure" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("CustomResultType", result);
        }

        [Fact]
        public void GetGeneratedTypeName_SingleWordName_ReturnsCapitalized()
        {
            var type = new MetricType
            {
                name = "result",
                type = "string",
                description = "Result",
                allowedValues = new[] { "Success" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("Result", result);
        }

        [Fact]
        public void GetGeneratedTypeName_SnakeCaseName_ReturnsPascalCase()
        {
            var type = new MetricType
            {
                name = "aws_account_id",
                type = "string",
                description = "AWS Account",
                allowedValues = new[] { "123" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("AwsAccountId", result);
        }

        [Fact]
        public void GetGeneratedTypeName_AlreadyPascalCase_RemainsUnchanged()
        {
            var type = new MetricType
            {
                name = "Result",
                type = "string",
                description = "Result",
                allowedValues = new[] { "Success" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("Result", result);
        }

        [Fact]
        public void GetGeneratedTypeName_WithNumbers_HandlesCorrectly()
        {
            var type = new MetricType
            {
                name = "s3_bucket_count",
                type = "string",
                description = "S3 bucket count",
                allowedValues = new[] { "1", "2" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("S3BucketCount", result);
        }

        [Fact]
        public void GetGeneratedTypeName_EmptyName_HandlesGracefully()
        {
            var type = new MetricType
            {
                name = "",
                type = "string",
                description = "Empty name",
                allowedValues = new[] { "value" }
            };

            var result = type.GetGeneratedTypeName();

            Assert.Equal("", result);
        }

        #endregion

        #region Edge Cases and Integration Tests

        [Fact]
        public void IsAliasedType_AndGetAliasedType_IntegrationTest()
        {
            var type = new MetricType
            {
                name = "testField",
                type = "int",
                description = "Test"
            };

            Assert.True(type.IsAliasedType());
            Assert.Equal(typeof(int), type.GetAliasedType());
        }

        [Fact]
        public void GetGeneratedTypeName_ForAllAliasedTypes_ReturnsCorrectNames()
        {
            var types = new[]
            {
                new { Type = "int", Expected = "Int32" },
                new { Type = "double", Expected = "Double" },
                new { Type = "string", Expected = "String" },
                new { Type = "boolean", Expected = "Boolean" }
            };

            foreach (var testCase in types)
            {
                var type = new MetricType
                {
                    name = "test",
                    type = testCase.Type,
                    description = "Test"
                };

                var result = type.GetGeneratedTypeName();
                Assert.Equal(testCase.Expected, result);
            }
        }

        [Fact]
        public void IsAliasedType_MultipleAllowedValues_ReturnsFalse()
        {
            var type = new MetricType
            {
                name = "status",
                type = "string",
                description = "Status",
                allowedValues = new[] { "Active", "Inactive", "Pending", "Cancelled" }
            };

            Assert.False(type.IsAliasedType());
        }

        #endregion
    }
}
