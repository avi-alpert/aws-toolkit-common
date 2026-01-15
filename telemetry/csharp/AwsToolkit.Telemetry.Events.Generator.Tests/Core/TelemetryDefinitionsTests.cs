using Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Models;
using FluentAssertions;
using System;
using System.IO;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Generator.Core.Tests
{
    public class TelemetryDefinitionsTests
    {
        [Fact]
        public void Load_ValidFile_LoadsDefinitionsSuccessfully()
        {
            // Arrange
            var filename = "SampleData/Inputs/sampleDefinitions.json";

            // Act
            var definitions = TelemetryDefinitions.Load(filename);

            // Assert
            definitions.Should().NotBeNull();
            definitions.types.Should().NotBeNull();
            definitions.metrics.Should().NotBeNull();
        }

        [Fact]
        public void Load_ValidFile_ProcessesMetricsMetadata()
        {
            // Arrange
            var filename = "SampleData/Inputs/sampleDefinitions.json";

            // Act
            var definitions = TelemetryDefinitions.Load(filename);

            // Assert
            foreach (var metric in definitions.metrics)
            {
                if (metric.metadata != null)
                {
                    foreach (var metadata in metric.metadata)
                    {
                        // All metadata should have required set (either true or explicitly false)
                        metadata.required.HasValue.Should().BeTrue();
                    }
                }
            }
        }

        [Fact]
        public void Load_NonExistentFile_ThrowsException()
        {
            // Arrange
            var filename = "nonexistent-file.json";

            // Act & Assert
            Assert.Throws<FileNotFoundException>(() => TelemetryDefinitions.Load(filename));
        }

        [Fact]
        public void Load_InvalidJson_ThrowsException()
        {
            // Arrange - Create a temporary file with invalid JSON
            var tempFile = Path.GetTempFileName();
            File.WriteAllText(tempFile, "{ invalid json }");

            try
            {
                // Act & Assert
                Assert.Throws<Newtonsoft.Json.JsonReaderException>(() => TelemetryDefinitions.Load(tempFile));
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Load_EmptyMetricsArray_LoadsSuccessfully()
        {
            // Arrange - Create a temporary file with empty metrics
            var tempFile = Path.GetTempFileName();
            File.WriteAllText(tempFile, @"{""types"": [], ""metrics"": []}");

            try
            {
                // Act
                var definitions = TelemetryDefinitions.Load(tempFile);

                // Assert
                definitions.Should().NotBeNull();
                definitions.metrics.Should().NotBeNull();
                definitions.metrics.Should().BeEmpty();
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Load_MetricsWithNullMetadata_ProcessesSuccessfully()
        {
            // Arrange
            var tempFile = Path.GetTempFileName();
            var json = @"{
                ""types"": [],
                ""metrics"": [
                    {
                        ""name"": ""test_metric"",
                        ""description"": ""Test"",
                        ""metadata"": null
                    }
                ]
            }";
            File.WriteAllText(tempFile, json);

            try
            {
                // Act
                var definitions = TelemetryDefinitions.Load(tempFile);

                // Assert
                definitions.Should().NotBeNull();
                definitions.metrics.Should().HaveCount(1);
                definitions.metrics[0].metadata.Should().BeNull();
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Load_MetricsWithEmptyMetadata_ProcessesSuccessfully()
        {
            // Arrange
            var tempFile = Path.GetTempFileName();
            var json = @"{
                ""types"": [],
                ""metrics"": [
                    {
                        ""name"": ""test_metric"",
                        ""description"": ""Test"",
                        ""metadata"": []
                    }
                ]
            }";
            File.WriteAllText(tempFile, json);

            try
            {
                // Act
                var definitions = TelemetryDefinitions.Load(tempFile);

                // Assert
                definitions.Should().NotBeNull();
                definitions.metrics.Should().HaveCount(1);
                definitions.metrics[0].metadata.Should().BeEmpty();
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Load_MetadataWithoutRequiredField_SetsRequiredToTrue()
        {
            // Arrange
            var tempFile = Path.GetTempFileName();
            var json = @"{
                ""types"": [],
                ""metrics"": [
                    {
                        ""name"": ""test_metric"",
                        ""description"": ""Test"",
                        ""metadata"": [
                            {
                                ""type"": ""string""
                            }
                        ]
                    }
                ]
            }";
            File.WriteAllText(tempFile, json);

            try
            {
                // Act
                var definitions = TelemetryDefinitions.Load(tempFile);

                // Assert
                definitions.metrics[0].metadata[0].required.Should().BeTrue();
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Load_MetadataWithRequiredFalse_PreservesRequiredFalse()
        {
            // Arrange
            var tempFile = Path.GetTempFileName();
            var json = @"{
                ""types"": [],
                ""metrics"": [
                    {
                        ""name"": ""test_metric"",
                        ""description"": ""Test"",
                        ""metadata"": [
                            {
                                ""type"": ""string"",
                                ""required"": false
                            }
                        ]
                    }
                ]
            }";
            File.WriteAllText(tempFile, json);

            try
            {
                // Act
                var definitions = TelemetryDefinitions.Load(tempFile);

                // Assert
                definitions.metrics[0].metadata[0].required.Should().BeFalse();
            }
            finally
            {
                // Cleanup
                File.Delete(tempFile);
            }
        }

        [Fact]
        public void Types_CanBeSet()
        {
            // Arrange
            var definitions = new TelemetryDefinitions();
            var types = new[] { new MetricType { name = "test", type = "string" } };

            // Act
            definitions.types = types;

            // Assert
            definitions.types.Should().HaveCount(1);
            definitions.types[0].name.Should().Be("test");
        }

        [Fact]
        public void Metrics_CanBeSet()
        {
            // Arrange
            var definitions = new TelemetryDefinitions();
            var metrics = new[] { new Metric { name = "test_metric" } };

            // Act
            definitions.metrics = metrics;

            // Assert
            definitions.metrics.Should().HaveCount(1);
            definitions.metrics[0].name.Should().Be("test_metric");
        }
    }
}
