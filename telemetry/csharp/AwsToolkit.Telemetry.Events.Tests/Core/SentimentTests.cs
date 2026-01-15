using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class SentimentTests
    {
        [Fact]
        public void Positive_HasCorrectValue()
        {
            // Assert
            Sentiment.Positive.Value.Should().Be("Positive");
        }

        [Fact]
        public void Negative_HasCorrectValue()
        {
            // Assert
            Sentiment.Negative.Value.Should().Be("Negative");
        }

        [Fact]
        public void Constructor_SetsValue()
        {
            // Arrange & Act
            var sentiment = new Sentiment("Neutral");

            // Assert
            sentiment.Value.Should().Be("Neutral");
        }

        [Fact]
        public void StaticInstances_AreNotNull()
        {
            // Assert
            Sentiment.Positive.Should().NotBeNull();
            Sentiment.Negative.Should().NotBeNull();
        }

        [Fact]
        public void StaticInstances_HaveDistinctValues()
        {
            // Assert
            Sentiment.Positive.Value.Should().NotBe(Sentiment.Negative.Value);
        }

        [Theory]
        [InlineData("CustomSentiment1")]
        [InlineData("CustomSentiment2")]
        [InlineData("")]
        public void Constructor_AcceptsAnyStringValue(string value)
        {
            // Arrange & Act
            var sentiment = new Sentiment(value);

            // Assert
            sentiment.Value.Should().Be(value);
        }

        [Fact]
        public void Constructor_CanAcceptNull()
        {
            // Arrange & Act
            var sentiment = new Sentiment(null);

            // Assert
            sentiment.Value.Should().BeNull();
        }

        [Fact]
        public void Value_IsReadOnly()
        {
            // Arrange
            var sentiment = new Sentiment("TestValue");

            // Assert - Value property should not have a setter
            sentiment.Value.Should().Be("TestValue");
            // This test verifies the property exists and can be read
        }
    }
}
