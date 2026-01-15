# Multi-stage build for aws-toolkit-common testing environment
# Supports C#, Kotlin/Java, and TypeScript/Node.js

FROM public.ecr.aws/docker/library/node:18 AS base

# Install .NET SDK 8.0
RUN apt-get update && apt-get install -y wget apt-transport-https && \
    wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y dotnet-sdk-8.0

# Install OpenJDK 17 for Gradle/Kotlin
RUN apt-get install -y openjdk-17-jdk

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1

WORKDIR /workspace

# Copy all project files
COPY . .

# Install Node.js dependencies for TypeScript projects
WORKDIR /workspace/telemetry/vscode
RUN npm install

WORKDIR /workspace/telemetry/validation
RUN npm install

# Set working directory back to root
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]
