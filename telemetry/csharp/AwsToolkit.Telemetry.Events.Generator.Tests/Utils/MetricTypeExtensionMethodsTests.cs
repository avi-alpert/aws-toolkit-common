using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Utils;
using FluentAssertions;
using System;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class MetricTypeExtensionMethodsTests
    {
        [Theory]
        [InlineData("int", typeof(int))]
        [InlineData("double", typeof(double))]
        [InlineData("string", typeof(string))]
        [InlineData("boolean", typeof(bool))]
        public void IsAliasedType_WithAliasedTypeAndNoAllowedValues_ReturnsTrue(string typeName, Type expectedType)
        {
            // Arrange
            var metricType = new MetricType
            {
                type = typeName,
                allowedValues = null
            };

            // Act
            var result = metricType.IsAliasedType();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void IsAliasedType_WithAllowedValues_ReturnsFalse()
        {
            // Arrange
            var metricType = new MetricType
            {
                type = "string",
                allowedValues = new[] { "Value1", "Value2" }
            };

            // Act
            var result = metricType.IsAliasedType();

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void IsAliasedType_WithEmptyAllowedValues_ReturnsTrue()
        {
            // Arrange
            var metricType = new MetricType
            {
                type = "string",
                allowedValues = new string[0]
            };

            // Act
            var result = metricType.IsAliasedType();

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void IsAliasedType_WithUnknownType_ReturnsFalse()
        {
            // Arrange
            var metricType = new MetricType
            {
                type = "unknownType",
                allowedValues = null
            };

            // Act
            var result = metricType.IsAliasedType();

            // Assert
            result.Should().BeFalse();
        }

        [Theory]
        [InlineData("int", typeof(int))]
        [InlineData("double", typeof(double))]
        [InlineData("string", typeof(string))]
        [InlineData("boolean", typeof(bool))]
        public void GetAliasedType_WithValidAliasedType_ReturnsCorrectType(string typeName, Type expectedType)
        {
            // Arrange
            var metricType = new MetricType
            {
                type = typeName,
                allowedValues = null
            };

            // Act
            var result = metricType.GetAliasedType();

            // Assert
            result.Should().Be(expectedType);
        }

        [Fact]
        public void GetAliasedType_WithNonAliasedType_ThrowsException()
        {
            // Arrange
            var metricType = new MetricType
            {
                type = "customType",
                allowedValues = null
            };

            // Act & Assert
            var exception = Assert.Throws<Exception>(() => metricType.GetAliasedType());
            exception.Message.Should().Contain("type not aliased");
            exception.Message.Should().Contain("customType");
        }

        [Fact]
        public void GetAliasedType_WithAllowedValues_ThrowsException()
        {
            // Arrange
            var metricType = new MetricType
            {
                type = "string",
                allowedValues = new[] { "Value1", "Value2" }
            };

            // Act & Assert
            var exception = Assert.Throws<Exception>(() => metricType.GetAliasedType());
            exception.Message.Should().Contain("type not aliased");
        }

        [Theory]
        [InlineData("int", "System.Int32")]
        [InlineData("double", "System.Double")]
        [InlineData("string", "System.String")]
        [InlineData("boolean", "System.Boolean")]
        public void GetGeneratedTypeName_WithAliasedType_ReturnsFullTypeName(string typeName, string expectedName)
        {
            // Arrange
            var metricType = new MetricType
            {
                name = typeName,
                type = typeName,
                allowedValues = null
            };

            // Act
            var result = metricType.GetGeneratedTypeName();

            // Assert
            result.Should().Be(expectedName);
        }

        [Fact]
        public void GetGeneratedTypeName_WithNonAliasedType_ReturnsPascalCaseName()
        {
            // Arrange
            var metricType = new MetricType
            {
                name = "custom_type",
                type = "customEnum",
                allowedValues = new[] { "Value1", "Value2" }
            };

            // Act
            var result = metricType.GetGeneratedTypeName();

            // Assert
            result.Should().Be("CustomType"); // PascalCase conversion splits on _ and capitalizes
        }

        [Theory]
        [InlineData("lowercase", "Lowercase")]
        [InlineData("UPPERCASE", "UPPERCASE")]
        [InlineData("camelCase", "CamelCase")]
        [InlineData("PascalCase", "PascalCase")]
        public void GetGeneratedTypeName_WithCustomType_AppliesPascalCase(string name, string expectedName)
        {
            // Arrange
            var metricType = new MetricType
            {
                name = name,
                type = "customType",
                allowedValues = new[] { "Value" }
            };

            // Act
            var result = metricType.GetGeneratedTypeName();

            // Assert
            result.Should().Be(expectedName);
        }

        [Fact]
        public void GetGeneratedTypeName_WithSnakeCaseName_ConvertsToPascalCase()
        {
            // Arrange
            var metricType = new MetricType
            {
                name = "result_type",
                type = "enumType",
                allowedValues = new[] { "Success", "Failure" }
            };

            // Act
            var result = metricType.GetGeneratedTypeName();

            // Assert
            result.Should().Be("ResultType"); // PascalCase conversion splits on _ and capitalizes
        }
    }
}
