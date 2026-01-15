using Amazon.AwsToolkit.Telemetry.Events.Core;
using System.Collections.Generic;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class MetricDatumTests
    {
        [Fact]
        public void Constructor_InitializesWithDefaults()
        {
            var datum = new MetricDatum();

            Assert.NotNull(datum.Metadata);
            Assert.Empty(datum.Metadata);
            Assert.Null(datum.MetricName);
            Assert.Equal(Unit.None, datum.Unit);
            Assert.Equal(0, datum.Value);
            Assert.False(datum.Passive);
            Assert.False(datum.TrackPerformance);
        }

        [Fact]
        public void MetricName_CanBeSet()
        {
            var datum = new MetricDatum
            {
                MetricName = "test_metric"
            };

            Assert.Equal("test_metric", datum.MetricName);
        }

        [Fact]
        public void Unit_CanBeSet()
        {
            var datum = new MetricDatum
            {
                Unit = Unit.Milliseconds
            };

            Assert.Equal(Unit.Milliseconds, datum.Unit);
        }

        [Fact]
        public void Value_CanBeSet()
        {
            var datum = new MetricDatum
            {
                Value = 42.5
            };

            Assert.Equal(42.5, datum.Value);
        }

        [Fact]
        public void Passive_CanBeSet()
        {
            var datum = new MetricDatum
            {
                Passive = true
            };

            Assert.True(datum.Passive);
        }

        [Fact]
        public void TrackPerformance_CanBeSet()
        {
            var datum = new MetricDatum
            {
                TrackPerformance = true
            };

            Assert.True(datum.TrackPerformance);
        }

        [Fact]
        public void Metadata_CanAddEntries()
        {
            var datum = new MetricDatum();
            datum.Metadata["key1"] = "value1";
            datum.Metadata["key2"] = "value2";

            Assert.Equal(2, datum.Metadata.Count);
            Assert.Equal("value1", datum.Metadata["key1"]);
            Assert.Equal("value2", datum.Metadata["key2"]);
        }

        [Fact]
        public void Metadata_CanOverwriteEntries()
        {
            var datum = new MetricDatum();
            datum.Metadata["key1"] = "value1";
            datum.Metadata["key1"] = "updated_value";

            Assert.Single(datum.Metadata);
            Assert.Equal("updated_value", datum.Metadata["key1"]);
        }

        [Fact]
        public void Metadata_SupportsEmptyStrings()
        {
            var datum = new MetricDatum();
            datum.Metadata["emptyKey"] = "";

            Assert.Single(datum.Metadata);
            Assert.Equal("", datum.Metadata["emptyKey"]);
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            var datum = new MetricDatum
            {
                MetricName = "lambda_invoke",
                Unit = Unit.Count,
                Value = 1,
                Passive = true,
                TrackPerformance = true
            };
            datum.Metadata["result"] = "Success";
            datum.Metadata["duration"] = "1500";

            Assert.Equal("lambda_invoke", datum.MetricName);
            Assert.Equal(Unit.Count, datum.Unit);
            Assert.Equal(1, datum.Value);
            Assert.True(datum.Passive);
            Assert.True(datum.TrackPerformance);
            Assert.Equal(2, datum.Metadata.Count);
        }

        [Fact]
        public void Value_SupportsNegativeNumbers()
        {
            var datum = new MetricDatum
            {
                Value = -10.5
            };

            Assert.Equal(-10.5, datum.Value);
        }

        [Fact]
        public void Value_SupportsLargeNumbers()
        {
            var datum = new MetricDatum
            {
                Value = double.MaxValue
            };

            Assert.Equal(double.MaxValue, datum.Value);
        }

        [Fact]
        public void MetricName_SupportsSpecialCharacters()
        {
            var datum = new MetricDatum
            {
                MetricName = "metric_with-special.chars:123"
            };

            Assert.Equal("metric_with-special.chars:123", datum.MetricName);
        }

        [Fact]
        public void Metadata_SupportsSpecialCharacterKeys()
        {
            var datum = new MetricDatum();
            datum.Metadata["key-with.special_chars"] = "value";

            Assert.Equal("value", datum.Metadata["key-with.special_chars"]);
        }

        [Fact]
        public void Metadata_SupportsSpecialCharacterValues()
        {
            var datum = new MetricDatum();
            datum.Metadata["key"] = "value with spaces and special chars: @#$%";

            Assert.Equal("value with spaces and special chars: @#$%", datum.Metadata["key"]);
        }

        [Fact]
        public void MultipleInstances_AreIndependent()
        {
            var datum1 = new MetricDatum { MetricName = "metric1" };
            var datum2 = new MetricDatum { MetricName = "metric2" };

            datum1.Metadata["key"] = "value1";
            datum2.Metadata["key"] = "value2";

            Assert.Equal("metric1", datum1.MetricName);
            Assert.Equal("metric2", datum2.MetricName);
            Assert.Equal("value1", datum1.Metadata["key"]);
            Assert.Equal("value2", datum2.Metadata["key"]);
        }

        [Fact]
        public void Metadata_IsInstanceSpecific()
        {
            var datum1 = new MetricDatum();
            var datum2 = new MetricDatum();

            datum1.Metadata["key1"] = "value1";
            datum2.Metadata["key2"] = "value2";

            Assert.Single(datum1.Metadata);
            Assert.Single(datum2.Metadata);
            Assert.True(datum1.Metadata.ContainsKey("key1"));
            Assert.False(datum1.Metadata.ContainsKey("key2"));
            Assert.False(datum2.Metadata.ContainsKey("key1"));
            Assert.True(datum2.Metadata.ContainsKey("key2"));
        }
    }
}
