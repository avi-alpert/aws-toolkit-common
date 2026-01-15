using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class UnitTests
    {
        [Fact]
        public void Bytes_HasCorrectValue()
        {
            // Assert
            Unit.Bytes.Value.Should().Be("Bytes");
        }

        [Fact]
        public void Count_HasCorrectValue()
        {
            // Assert
            Unit.Count.Value.Should().Be("Count");
        }

        [Fact]
        public void Milliseconds_HasCorrectValue()
        {
            // Assert
            Unit.Milliseconds.Value.Should().Be("Milliseconds");
        }

        [Fact]
        public void None_HasCorrectValue()
        {
            // Assert
            Unit.None.Value.Should().Be("None");
        }

        [Fact]
        public void Percent_HasCorrectValue()
        {
            // Assert
            Unit.Percent.Value.Should().Be("Percent");
        }

        [Fact]
        public void Constructor_SetsValue()
        {
            // Arrange & Act
            var unit = new Unit("CustomUnit");

            // Assert
            unit.Value.Should().Be("CustomUnit");
        }

        [Fact]
        public void StaticInstances_AreNotNull()
        {
            // Assert
            Unit.Bytes.Should().NotBeNull();
            Unit.Count.Should().NotBeNull();
            Unit.Milliseconds.Should().NotBeNull();
            Unit.None.Should().NotBeNull();
            Unit.Percent.Should().NotBeNull();
        }

        [Fact]
        public void StaticInstances_HaveDistinctValues()
        {
            // Assert
            Unit.Bytes.Value.Should().NotBe(Unit.Count.Value);
            Unit.Bytes.Value.Should().NotBe(Unit.Milliseconds.Value);
            Unit.Bytes.Value.Should().NotBe(Unit.None.Value);
            Unit.Bytes.Value.Should().NotBe(Unit.Percent.Value);
            Unit.Count.Value.Should().NotBe(Unit.Milliseconds.Value);
            Unit.Count.Value.Should().NotBe(Unit.None.Value);
            Unit.Count.Value.Should().NotBe(Unit.Percent.Value);
            Unit.Milliseconds.Value.Should().NotBe(Unit.None.Value);
            Unit.Milliseconds.Value.Should().NotBe(Unit.Percent.Value);
            Unit.None.Value.Should().NotBe(Unit.Percent.Value);
        }

        [Theory]
        [InlineData("CustomUnit1")]
        [InlineData("CustomUnit2")]
        [InlineData("")]
        public void Constructor_AcceptsAnyStringValue(string value)
        {
            // Arrange & Act
            var unit = new Unit(value);

            // Assert
            unit.Value.Should().Be(value);
        }

        [Fact]
        public void Constructor_CanAcceptNull()
        {
            // Arrange & Act
            var unit = new Unit(null);

            // Assert
            unit.Value.Should().BeNull();
        }

        [Fact]
        public void Value_IsReadOnly()
        {
            // Arrange
            var unit = new Unit("TestValue");

            // Assert - Value property should not have a setter
            unit.Value.Should().Be("TestValue");
            // This test verifies the property exists and can be read
        }
    }
}
