using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class MetadataTests
    {
        [Fact]
        public void ResolvedRequired_WhenRequiredIsNull_ReturnsTrue()
        {
            // Arrange
            var metadata = new Metadata
            {
                type = "string",
                required = null
            };

            // Act
            var result = metadata.ResolvedRequired;

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ResolvedRequired_WhenRequiredIsTrue_ReturnsTrue()
        {
            // Arrange
            var metadata = new Metadata
            {
                type = "string",
                required = true
            };

            // Act
            var result = metadata.ResolvedRequired;

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void ResolvedRequired_WhenRequiredIsFalse_ReturnsFalse()
        {
            // Arrange
            var metadata = new Metadata
            {
                type = "string",
                required = false
            };

            // Act
            var result = metadata.ResolvedRequired;

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void Type_CanBeSet()
        {
            // Arrange
            var metadata = new Metadata();

            // Act
            metadata.type = "int";

            // Assert
            metadata.type.Should().Be("int");
        }

        [Fact]
        public void Required_CanBeSetToNull()
        {
            // Arrange
            var metadata = new Metadata { required = true };

            // Act
            metadata.required = null;

            // Assert
            metadata.required.Should().BeNull();
        }

        [Theory]
        [InlineData("string")]
        [InlineData("int")]
        [InlineData("double")]
        [InlineData("boolean")]
        public void Type_SupportsCommonTypes(string typeValue)
        {
            // Arrange & Act
            var metadata = new Metadata { type = typeValue };

            // Assert
            metadata.type.Should().Be(typeValue);
        }
    }
}
