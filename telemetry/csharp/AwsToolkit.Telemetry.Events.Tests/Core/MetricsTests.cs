using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using System;
using System.Collections.Generic;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class MetricsTests
    {
        [Fact]
        public void Constructor_InitializesDataList()
        {
            // Arrange & Act
            var metrics = new Metrics();

            // Assert
            metrics.Data.Should().NotBeNull();
            metrics.Data.Should().BeEmpty();
        }

        [Fact]
        public void CreatedOn_CanBeSet()
        {
            // Arrange
            var metrics = new Metrics();
            var dateTime = DateTime.UtcNow;

            // Act
            metrics.CreatedOn = dateTime;

            // Assert
            metrics.CreatedOn.Should().Be(dateTime);
        }

        [Fact]
        public void Data_CanAddMetricDatum()
        {
            // Arrange
            var metrics = new Metrics();
            var datum = new MetricDatum
            {
                MetricName = "test_metric",
                Value = 1.0
            };

            // Act
            metrics.Data.Add(datum);

            // Assert
            metrics.Data.Should().HaveCount(1);
            metrics.Data[0].Should().Be(datum);
        }

        [Fact]
        public void Data_CanAddMultipleMetricData()
        {
            // Arrange
            var metrics = new Metrics();
            var datum1 = new MetricDatum { MetricName = "metric1" };
            var datum2 = new MetricDatum { MetricName = "metric2" };

            // Act
            metrics.Data.Add(datum1);
            metrics.Data.Add(datum2);

            // Assert
            metrics.Data.Should().HaveCount(2);
            metrics.Data[0].MetricName.Should().Be("metric1");
            metrics.Data[1].MetricName.Should().Be("metric2");
        }

        [Fact]
        public void Data_CanBeCleared()
        {
            // Arrange
            var metrics = new Metrics();
            metrics.Data.Add(new MetricDatum { MetricName = "test" });

            // Act
            metrics.Data.Clear();

            // Assert
            metrics.Data.Should().BeEmpty();
        }

        [Fact]
        public void Data_CanBeReassigned()
        {
            // Arrange
            var metrics = new Metrics();
            var newData = new List<MetricDatum>
            {
                new MetricDatum { MetricName = "metric1" },
                new MetricDatum { MetricName = "metric2" }
            };

            // Act
            metrics.Data = newData;

            // Assert
            metrics.Data.Should().HaveCount(2);
            metrics.Data.Should().BeSameAs(newData);
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            // Arrange
            var dateTime = DateTime.UtcNow;
            var datum1 = new MetricDatum
            {
                MetricName = "lambda_invoke",
                Unit = Unit.Count,
                Value = 1.0
            };
            var datum2 = new MetricDatum
            {
                MetricName = "s3_upload",
                Unit = Unit.Bytes,
                Value = 1024.0
            };

            // Act
            var metrics = new Metrics
            {
                CreatedOn = dateTime,
                Data = new List<MetricDatum> { datum1, datum2 }
            };

            // Assert
            metrics.CreatedOn.Should().Be(dateTime);
            metrics.Data.Should().HaveCount(2);
            metrics.Data[0].MetricName.Should().Be("lambda_invoke");
            metrics.Data[1].MetricName.Should().Be("s3_upload");
        }

        [Fact]
        public void Data_RemoveMetricDatum()
        {
            // Arrange
            var metrics = new Metrics();
            var datum1 = new MetricDatum { MetricName = "metric1" };
            var datum2 = new MetricDatum { MetricName = "metric2" };
            metrics.Data.Add(datum1);
            metrics.Data.Add(datum2);

            // Act
            metrics.Data.Remove(datum1);

            // Assert
            metrics.Data.Should().HaveCount(1);
            metrics.Data[0].Should().Be(datum2);
        }

        [Fact]
        public void CreatedOn_DefaultValue()
        {
            // Arrange & Act
            var metrics = new Metrics();

            // Assert
            metrics.CreatedOn.Should().Be(default(DateTime));
        }
    }
}
