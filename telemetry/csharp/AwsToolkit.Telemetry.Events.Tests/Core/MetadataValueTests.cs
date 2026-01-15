using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class MetadataValueTests
    {
        [Fact]
        public void NotApplicable_HasCorrectValue()
        {
            // Assert
            MetadataValue.NotApplicable.Should().Be("n/a");
        }

        [Fact]
        public void NotSet_HasCorrectValue()
        {
            // Assert
            MetadataValue.NotSet.Should().Be("not-set");
        }

        [Fact]
        public void Invalid_HasCorrectValue()
        {
            // Assert
            MetadataValue.Invalid.Should().Be("invalid");
        }

        [Fact]
        public void AllConstants_AreDistinct()
        {
            // Assert
            MetadataValue.NotApplicable.Should().NotBe(MetadataValue.NotSet);
            MetadataValue.NotApplicable.Should().NotBe(MetadataValue.Invalid);
            MetadataValue.NotSet.Should().NotBe(MetadataValue.Invalid);
        }

        [Fact]
        public void Constants_AreNotNull()
        {
            // Assert
            MetadataValue.NotApplicable.Should().NotBeNull();
            MetadataValue.NotSet.Should().NotBeNull();
            MetadataValue.Invalid.Should().NotBeNull();
        }

        [Fact]
        public void Constants_AreNotEmpty()
        {
            // Assert
            MetadataValue.NotApplicable.Should().NotBeEmpty();
            MetadataValue.NotSet.Should().NotBeEmpty();
            MetadataValue.Invalid.Should().NotBeEmpty();
        }
    }
}
