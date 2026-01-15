using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class MetricTypeTests
    {
        [Fact]
        public void Name_CanBeSet()
        {
            // Arrange
            var metricType = new MetricType();

            // Act
            metricType.name = "result";

            // Assert
            metricType.name.Should().Be("result");
        }

        [Fact]
        public void Type_CanBeSet()
        {
            // Arrange
            var metricType = new MetricType();

            // Act
            metricType.type = "string";

            // Assert
            metricType.type.Should().Be("string");
        }

        [Fact]
        public void Description_CanBeSet()
        {
            // Arrange
            var metricType = new MetricType();

            // Act
            metricType.description = "Result of an operation";

            // Assert
            metricType.description.Should().Be("Result of an operation");
        }

        [Fact]
        public void AllowedValues_CanBeSetWithArray()
        {
            // Arrange
            var metricType = new MetricType();
            var allowedValues = new[] { "Succeeded", "Failed", "Cancelled" };

            // Act
            metricType.allowedValues = allowedValues;

            // Assert
            metricType.allowedValues.Should().HaveCount(3);
            metricType.allowedValues.Should().Contain("Succeeded");
            metricType.allowedValues.Should().Contain("Failed");
            metricType.allowedValues.Should().Contain("Cancelled");
        }

        [Fact]
        public void AllowedValues_CanBeNull()
        {
            // Arrange & Act
            var metricType = new MetricType { allowedValues = null };

            // Assert
            metricType.allowedValues.Should().BeNull();
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            // Arrange & Act
            var metricType = new MetricType
            {
                name = "result",
                type = "string",
                description = "The result of an operation",
                allowedValues = new[] { "Succeeded", "Failed" }
            };

            // Assert
            metricType.name.Should().Be("result");
            metricType.type.Should().Be("string");
            metricType.description.Should().Be("The result of an operation");
            metricType.allowedValues.Should().HaveCount(2);
        }

        [Theory]
        [InlineData("string")]
        [InlineData("int")]
        [InlineData("double")]
        [InlineData("boolean")]
        public void Type_SupportsCommonTypes(string typeValue)
        {
            // Arrange & Act
            var metricType = new MetricType { type = typeValue };

            // Assert
            metricType.type.Should().Be(typeValue);
        }

        [Fact]
        public void AllowedValues_CanBeEmpty()
        {
            // Arrange & Act
            var metricType = new MetricType { allowedValues = new string[0] };

            // Assert
            metricType.allowedValues.Should().BeEmpty();
        }
    }
}
