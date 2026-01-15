using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class MetricDatumTests
    {
        [Fact]
        public void Constructor_InitializesMetadataDictionary()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum();

            // Assert
            metricDatum.Metadata.Should().NotBeNull();
            metricDatum.Metadata.Should().BeEmpty();
        }

        [Fact]
        public void MetricName_CanBeSet()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.MetricName = "test_metric";

            // Assert
            metricDatum.MetricName.Should().Be("test_metric");
        }

        [Fact]
        public void Unit_DefaultsToNone()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum();

            // Assert
            metricDatum.Unit.Should().Be(Unit.None);
        }

        [Fact]
        public void Unit_CanBeSet()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.Unit = Unit.Milliseconds;

            // Assert
            metricDatum.Unit.Should().Be(Unit.Milliseconds);
        }

        [Fact]
        public void Value_DefaultsToZero()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum();

            // Assert
            metricDatum.Value.Should().Be(0);
        }

        [Fact]
        public void Value_CanBeSet()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.Value = 42.5;

            // Assert
            metricDatum.Value.Should().Be(42.5);
        }

        [Fact]
        public void Passive_DefaultsToFalse()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum();

            // Assert
            metricDatum.Passive.Should().BeFalse();
        }

        [Fact]
        public void Passive_CanBeSet()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.Passive = true;

            // Assert
            metricDatum.Passive.Should().BeTrue();
        }

        [Fact]
        public void TrackPerformance_DefaultsToFalse()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum();

            // Assert
            metricDatum.TrackPerformance.Should().BeFalse();
        }

        [Fact]
        public void TrackPerformance_CanBeSet()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.TrackPerformance = true;

            // Assert
            metricDatum.TrackPerformance.Should().BeTrue();
        }

        [Fact]
        public void Metadata_CanAddEntries()
        {
            // Arrange
            var metricDatum = new MetricDatum();

            // Act
            metricDatum.Metadata["key1"] = "value1";
            metricDatum.Metadata["key2"] = "value2";

            // Assert
            metricDatum.Metadata.Should().HaveCount(2);
            metricDatum.Metadata["key1"].Should().Be("value1");
            metricDatum.Metadata["key2"].Should().Be("value2");
        }

        [Fact]
        public void Metadata_CanBeCleared()
        {
            // Arrange
            var metricDatum = new MetricDatum();
            metricDatum.Metadata["key1"] = "value1";

            // Act
            metricDatum.Metadata.Clear();

            // Assert
            metricDatum.Metadata.Should().BeEmpty();
        }

        [Fact]
        public void Metadata_CanOverwriteExistingKey()
        {
            // Arrange
            var metricDatum = new MetricDatum();
            metricDatum.Metadata["key1"] = "original";

            // Act
            metricDatum.Metadata["key1"] = "updated";

            // Assert
            metricDatum.Metadata["key1"].Should().Be("updated");
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            // Arrange & Act
            var metricDatum = new MetricDatum
            {
                MetricName = "lambda_invoke",
                Unit = Unit.Count,
                Value = 1.0,
                Passive = true,
                TrackPerformance = true
            };
            metricDatum.Metadata["result"] = "Succeeded";

            // Assert
            metricDatum.MetricName.Should().Be("lambda_invoke");
            metricDatum.Unit.Should().Be(Unit.Count);
            metricDatum.Value.Should().Be(1.0);
            metricDatum.Passive.Should().BeTrue();
            metricDatum.TrackPerformance.Should().BeTrue();
            metricDatum.Metadata.Should().ContainKey("result");
            metricDatum.Metadata["result"].Should().Be("Succeeded");
        }
    }
}
