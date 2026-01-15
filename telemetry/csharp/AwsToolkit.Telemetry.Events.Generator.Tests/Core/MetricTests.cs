using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class MetricTests
    {
        [Fact]
        public void Name_CanBeSet()
        {
            // Arrange
            var metric = new Metric();

            // Act
            metric.name = "testMetric";

            // Assert
            metric.name.Should().Be("testMetric");
        }

        [Fact]
        public void Description_CanBeSet()
        {
            // Arrange
            var metric = new Metric();

            // Act
            metric.description = "Test description";

            // Assert
            metric.description.Should().Be("Test description");
        }

        [Fact]
        public void Metadata_CanBeSetWithArray()
        {
            // Arrange
            var metric = new Metric();
            var metadata = new[]
            {
                new Metadata { type = "string", required = true },
                new Metadata { type = "int", required = false }
            };

            // Act
            metric.metadata = metadata;

            // Assert
            metric.metadata.Should().HaveCount(2);
            metric.metadata[0].type.Should().Be("string");
            metric.metadata[1].type.Should().Be("int");
        }

        [Fact]
        public void Unit_CanBeSet()
        {
            // Arrange
            var metric = new Metric();

            // Act
            metric.unit = "Milliseconds";

            // Assert
            metric.unit.Should().Be("Milliseconds");
        }

        [Fact]
        public void Passive_DefaultsToFalse()
        {
            // Arrange & Act
            var metric = new Metric();

            // Assert
            metric.passive.Should().BeFalse();
        }

        [Fact]
        public void Passive_CanBeSetToTrue()
        {
            // Arrange
            var metric = new Metric();

            // Act
            metric.passive = true;

            // Assert
            metric.passive.Should().BeTrue();
        }

        [Fact]
        public void TrackPerformance_DefaultsToFalse()
        {
            // Arrange & Act
            var metric = new Metric();

            // Assert
            metric.trackPerformance.Should().BeFalse();
        }

        [Fact]
        public void TrackPerformance_CanBeSetToTrue()
        {
            // Arrange
            var metric = new Metric();

            // Act
            metric.trackPerformance = true;

            // Assert
            metric.trackPerformance.Should().BeTrue();
        }

        [Fact]
        public void Metadata_CanBeNull()
        {
            // Arrange & Act
            var metric = new Metric { metadata = null };

            // Assert
            metric.metadata.Should().BeNull();
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            // Arrange & Act
            var metric = new Metric
            {
                name = "lambda_invoke",
                description = "Invokes a Lambda function",
                metadata = new[]
                {
                    new Metadata { type = "result", required = true }
                },
                unit = "Count",
                passive = false,
                trackPerformance = true
            };

            // Assert
            metric.name.Should().Be("lambda_invoke");
            metric.description.Should().Be("Invokes a Lambda function");
            metric.metadata.Should().HaveCount(1);
            metric.unit.Should().Be("Count");
            metric.passive.Should().BeFalse();
            metric.trackPerformance.Should().BeTrue();
        }
    }
}
