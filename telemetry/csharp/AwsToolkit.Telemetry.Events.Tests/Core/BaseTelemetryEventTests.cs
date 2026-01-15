using Amazon.AwsToolkit.Telemetry.Events.Core;
using FluentAssertions;
using System;
using Xunit;

namespace Amazon.AwsToolkit.Telemetry.Events.Tests.Core
{
    public class BaseTelemetryEventTests
    {
        private class TestTelemetryEvent : BaseTelemetryEvent
        {
        }

        [Fact]
        public void Passive_DefaultsToFalse()
        {
            // Arrange & Act
            var telemetryEvent = new TestTelemetryEvent();

            // Assert
            telemetryEvent.Passive.Should().BeFalse();
        }

        [Fact]
        public void Passive_CanBeSetToTrue()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Passive = true;

            // Assert
            telemetryEvent.Passive.Should().BeTrue();
        }

        [Fact]
        public void TrackPerformance_DefaultsToFalse()
        {
            // Arrange & Act
            var telemetryEvent = new TestTelemetryEvent();

            // Assert
            telemetryEvent.TrackPerformance.Should().BeFalse();
        }

        [Fact]
        public void TrackPerformance_CanBeSetToTrue()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.TrackPerformance = true;

            // Assert
            telemetryEvent.TrackPerformance.Should().BeTrue();
        }

        [Fact]
        public void Reason_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Reason = "FileIOException";

            // Assert
            telemetryEvent.Reason.Should().Be("FileIOException");
        }

        [Fact]
        public void ReasonDescription_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.ReasonDescription = "Failed to read file";

            // Assert
            telemetryEvent.ReasonDescription.Should().Be("Failed to read file");
        }

        [Fact]
        public void Source_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Source = "UserAction";

            // Assert
            telemetryEvent.Source.Should().Be("UserAction");
        }

        [Fact]
        public void ErrorCode_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.ErrorCode = "ERR_001";

            // Assert
            telemetryEvent.ErrorCode.Should().Be("ERR_001");
        }

        [Fact]
        public void CausedBy_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.CausedBy = "client";

            // Assert
            telemetryEvent.CausedBy.Should().Be("client");
        }

        [Fact]
        public void HttpStatusCode_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.HttpStatusCode = "404";

            // Assert
            telemetryEvent.HttpStatusCode.Should().Be("404");
        }

        [Fact]
        public void RequestId_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.RequestId = "req-12345";

            // Assert
            telemetryEvent.RequestId.Should().Be("req-12345");
        }

        [Fact]
        public void TraceId_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.TraceId = "trace-12345";

            // Assert
            telemetryEvent.TraceId.Should().Be("trace-12345");
        }

        [Fact]
        public void MetricId_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.MetricId = "metric-12345";

            // Assert
            telemetryEvent.MetricId.Should().Be("metric-12345");
        }

        [Fact]
        public void ParentId_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.ParentId = "parent-12345";

            // Assert
            telemetryEvent.ParentId.Should().Be("parent-12345");
        }

        [Fact]
        public void RequestServiceType_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.RequestServiceType = "s3";

            // Assert
            telemetryEvent.RequestServiceType.Should().Be("s3");
        }

        [Fact]
        public void Duration_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Duration = 123.45;

            // Assert
            telemetryEvent.Duration.Should().Be(123.45);
        }

        [Fact]
        public void Duration_CanBeNull()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Duration = null;

            // Assert
            telemetryEvent.Duration.Should().BeNull();
        }

        [Fact]
        public void Locale_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Locale = "en-US";

            // Assert
            telemetryEvent.Locale.Should().Be("en-US");
        }

        [Fact]
        public void CreatedOn_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();
            var dateTime = DateTime.UtcNow;

            // Act
            telemetryEvent.CreatedOn = dateTime;

            // Assert
            telemetryEvent.CreatedOn.Should().Be(dateTime);
        }

        [Fact]
        public void CreatedOn_CanBeNull()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.CreatedOn = null;

            // Assert
            telemetryEvent.CreatedOn.Should().BeNull();
        }

        [Fact]
        public void Value_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Value = 42.5;

            // Assert
            telemetryEvent.Value.Should().Be(42.5);
        }

        [Fact]
        public void Value_CanBeNull()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.Value = null;

            // Assert
            telemetryEvent.Value.Should().BeNull();
        }

        [Fact]
        public void AwsAccount_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.AwsAccount = "123456789012";

            // Assert
            telemetryEvent.AwsAccount.Should().Be("123456789012");
        }

        [Fact]
        public void AwsRegion_CanBeSet()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();

            // Act
            telemetryEvent.AwsRegion = "us-east-1";

            // Assert
            telemetryEvent.AwsRegion.Should().Be("us-east-1");
        }

        [Fact]
        public void AllProperties_CanBeSetTogether()
        {
            // Arrange
            var telemetryEvent = new TestTelemetryEvent();
            var testDate = DateTime.UtcNow;

            // Act
            telemetryEvent.Passive = true;
            telemetryEvent.TrackPerformance = true;
            telemetryEvent.Reason = "TestReason";
            telemetryEvent.ReasonDescription = "Test Description";
            telemetryEvent.Source = "TestSource";
            telemetryEvent.ErrorCode = "ERR_TEST";
            telemetryEvent.CausedBy = "user";
            telemetryEvent.HttpStatusCode = "200";
            telemetryEvent.RequestId = "req-test";
            telemetryEvent.TraceId = "trace-test";
            telemetryEvent.MetricId = "metric-test";
            telemetryEvent.ParentId = "parent-test";
            telemetryEvent.RequestServiceType = "lambda";
            telemetryEvent.Duration = 100.5;
            telemetryEvent.Locale = "en-GB";
            telemetryEvent.CreatedOn = testDate;
            telemetryEvent.Value = 99.9;
            telemetryEvent.AwsAccount = "987654321098";
            telemetryEvent.AwsRegion = "eu-west-1";

            // Assert
            telemetryEvent.Passive.Should().BeTrue();
            telemetryEvent.TrackPerformance.Should().BeTrue();
            telemetryEvent.Reason.Should().Be("TestReason");
            telemetryEvent.ReasonDescription.Should().Be("Test Description");
            telemetryEvent.Source.Should().Be("TestSource");
            telemetryEvent.ErrorCode.Should().Be("ERR_TEST");
            telemetryEvent.CausedBy.Should().Be("user");
            telemetryEvent.HttpStatusCode.Should().Be("200");
            telemetryEvent.RequestId.Should().Be("req-test");
            telemetryEvent.TraceId.Should().Be("trace-test");
            telemetryEvent.MetricId.Should().Be("metric-test");
            telemetryEvent.ParentId.Should().Be("parent-test");
            telemetryEvent.RequestServiceType.Should().Be("lambda");
            telemetryEvent.Duration.Should().Be(100.5);
            telemetryEvent.Locale.Should().Be("en-GB");
            telemetryEvent.CreatedOn.Should().Be(testDate);
            telemetryEvent.Value.Should().Be(99.9);
            telemetryEvent.AwsAccount.Should().Be("987654321098");
            telemetryEvent.AwsRegion.Should().Be("eu-west-1");
        }
    }
}
