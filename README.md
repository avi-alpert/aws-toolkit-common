# AWS Toolkit Common

[![Build Status](https://github.com/aws/aws-toolkit-common/workflows/CI/badge.svg)](https://github.com/aws/aws-toolkit-common/actions)

This repository contains shared components and infrastructure used across the AWS Toolkit family of IDE extensions. It serves as a central location for common functionality that powers AWS development experiences in multiple IDEs.

## Overview

AWS Toolkit Common provides shared components that enable consistent behavior and telemetry across the AWS Toolkit family of extensions. By centralizing common functionality, we ensure a unified developer experience across different IDEs while reducing code duplication.

### Role in the AWS Toolkits Ecosystem

This repository supports the following AWS Toolkit extensions:

* **[AWS Toolkit for JetBrains](https://github.com/aws/aws-toolkit-jetbrains)** - IntelliJ IDEA, PyCharm, WebStorm, and other JetBrains IDEs
* **[AWS Toolkit for VS Code](https://github.com/aws/aws-toolkit-vscode/)** - Visual Studio Code and related editors
* **[AWS Toolkit for Visual Studio](https://github.com/aws/aws-toolkit-visual-studio)** - Visual Studio on Windows

Each toolkit consumes the shared components from this repository to provide consistent telemetry, metrics, and shared functionality.

## Components

### Telemetry System

The telemetry system is the primary shared component in this repository. It provides a standardized approach to collecting, generating, and reporting telemetry data across all AWS Toolkit extensions.

**Key Features:**
- **Type-safe telemetry definitions** - JSON-based metric and type definitions that generate strongly-typed code
- **Multi-language support** - Generates telemetry code for TypeScript, Kotlin, and C#
- **Validation tools** - Ensures telemetry definitions follow proper format and conventions
- **Centralized definitions** - Common telemetry metrics shared across all toolkits

**Components:**

| Directory | Purpose |
|-----------|---------|
| `telemetry/definitions/` | JSON files containing telemetry metric and type definitions |
| `telemetry/vscode/` | TypeScript generator for VS Code toolkit |
| `telemetry/jetbrains/` | Kotlin generator for JetBrains toolkits |
| `telemetry/csharp/` | C# generator for Visual Studio toolkit |
| `telemetry/validation/` | Tools to validate telemetry definition files |
| `telemetry/service/` | Telemetry service configuration |

For detailed telemetry documentation, see [telemetry/README.md](telemetry/README.md).

## Language Implementations

This repository contains telemetry generators for three different languages, allowing each IDE extension to consume telemetry in its native language.

### TypeScript (VS Code)

The TypeScript implementation generates telemetry code for the AWS Toolkit for VS Code.

**Location:** `telemetry/vscode/`

**Key Technologies:**
- TypeScript 5.5+
- Node.js
- ts-morph for code generation
- Jest for testing

**Package:** `@aws-toolkits/telemetry`

### Kotlin (JetBrains)

The Kotlin implementation generates telemetry code for the AWS Toolkit for JetBrains IDEs.

**Location:** `telemetry/jetbrains/`

**Key Technologies:**
- Kotlin
- Gradle build system
- Gradle composite builds for prototyping

### C# (Visual Studio)

The C# implementation generates telemetry code for the AWS Toolkit for Visual Studio.

**Location:** `telemetry/csharp/`

**Key Technologies:**
- C# / .NET
- MSBuild
- Supplemental telemetry support

## Setup and Installation

### Prerequisites

Depending on which component you're working with, you'll need:

- **For TypeScript/VS Code:**
  - Node.js (LTS version recommended)
  - npm or yarn package manager

- **For Kotlin/JetBrains:**
  - JDK 11 or higher
  - Gradle (wrapper included)

- **For C#/Visual Studio:**
  - .NET SDK
  - Visual Studio or .NET CLI

### Installing Dependencies

#### VS Code Generator (TypeScript)

```bash
cd telemetry/vscode
npm install
npm run build
```

#### JetBrains Generator (Kotlin)

```bash
cd telemetry/jetbrains
./gradlew build
```

#### Visual Studio Generator (C#)

```bash
cd telemetry/csharp
dotnet build AwsToolkit.Telemetry.sln
```

## Usage Guidelines

### Adding New Telemetry

The process for adding telemetry varies by IDE. See the [telemetry README](telemetry/README.md) for detailed instructions.

**Quick Start:**

1. **Edit definitions** - Add your telemetry metrics and types to the appropriate JSON file in `telemetry/definitions/`
2. **Validate changes** - Run validation tools to ensure proper formatting:
   ```bash
   cd telemetry/validation
   npm install
   npm run validate
   npm run fix  # Auto-fix simple issues like ordering
   ```
3. **Generate code** - Run the generator in your target toolkit repository
4. **Test** - Verify the generated code works as expected

### Example: Adding a New Metric

Add a metric definition to `telemetry/definitions/commonDefinitions.json`:

```json
{
  "name": "lambda_invoke",
  "description": "Invoked a Lambda function",
  "unit": "None",
  "passive": false,
  "metadata": [
    { "type": "result" },
    { "type": "duration" }
  ]
}
```

Add a supporting type if needed:

```json
{
  "name": "lambdaRuntime",
  "type": "string",
  "allowedValues": ["python3.9", "nodejs18.x", "java11"],
  "description": "The runtime of a Lambda function"
}
```

### Consuming Generators in IDE Extensions

Each IDE extension consumes the generators differently:

- **VS Code:** Install as npm dependency `@aws-toolkits/telemetry`
- **JetBrains:** Use Gradle composite builds during development
- **Visual Studio:** Run generator executable to produce C# code

See individual README files in each language directory for specific integration instructions:
- [vscode/README.md](telemetry/vscode/README.md)
- [jetbrains/README.md](telemetry/jetbrains/README.md)
- [csharp/README.md](telemetry/csharp/README.md)

## Project Structure

```
aws-toolkit-common/
├── telemetry/                          # Main telemetry component
│   ├── definitions/                    # Telemetry metric definitions (JSON)
│   │   ├── commonDefinitions.json     # Shared across all toolkits
│   │   └── vscodeDefinitions.json     # VS Code specific definitions
│   ├── vscode/                         # TypeScript generator for VS Code
│   │   ├── src/                       # Generator source code
│   │   ├── test/                      # Generator tests
│   │   └── package.json               # npm package configuration
│   ├── jetbrains/                      # Kotlin generator for JetBrains
│   │   ├── src/                       # Generator source code
│   │   └── build.gradle.kts           # Gradle build configuration
│   ├── csharp/                         # C# generator for Visual Studio
│   │   ├── AwsToolkit.Telemetry.Events.Generator/  # Generator project
│   │   ├── AwsToolkit.Telemetry.Events/            # Generated events
│   │   └── AwsToolkit.Telemetry.sln   # Solution file
│   ├── validation/                     # Validation tools
│   ├── service/                        # Service configuration
│   ├── telemetrySchema.json           # JSON schema for definitions
│   └── telemetryformat.md             # Format specification
├── buildspec/                          # CI/CD build specifications
│   ├── nodeTests.yml                  # TypeScript/Node tests
│   ├── kotlinTests.yml                # Kotlin tests
│   └── csharpTests.yml                # C# tests
├── CONTRIBUTING.md                     # Contribution guidelines
├── CODE_OF_CONDUCT.md                 # Code of conduct
└── version                            # Repository version number
```

## Contributing

We welcome contributions to AWS Toolkit Common! However, please note that this repository contains internal infrastructure components primarily used by the AWS Toolkit extensions. 

**For Contributors:**

- **Toolkit features:** If you want to contribute features to the AWS Toolkits, please contribute directly to the toolkit repositories listed above
- **Shared components:** Contributions to this repository are welcome if they improve shared functionality

Before contributing, please:

1. Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide
2. Check existing issues and pull requests
3. For significant changes, open an issue first to discuss your proposal
4. Ensure all tests pass locally before submitting a PR

### Development Workflow

1. **Fork** this repository
2. **Create a branch** for your changes
3. **Make changes** following existing code style and conventions
4. **Run tests** for the component you modified:
   - TypeScript: `cd telemetry/vscode && npm test`
   - Kotlin: `cd telemetry/jetbrains && ./gradlew test`
   - C#: `cd telemetry/csharp && dotnet test`
5. **Run validation** for telemetry changes:
   - `cd telemetry/validation && npm run validate`
6. **Submit a pull request** with a clear description

### Code Style

- **TypeScript:** Uses Prettier for formatting (config in `.prettierrc`)
- **Kotlin:** Follows standard Kotlin conventions (config in `.editorconfig`)
- **C#:** Follows standard C# conventions

### Testing

All changes should include appropriate tests. The CI pipeline runs tests for all three language implementations:

```bash
# Run all tests locally
npm test                          # In telemetry/vscode
./gradlew test                    # In telemetry/jetbrains
dotnet test                       # In telemetry/csharp
```

## Related Resources

### AWS Toolkit Repositories

- [AWS Toolkit for JetBrains](https://github.com/aws/aws-toolkit-jetbrains) - IntelliJ, PyCharm, WebStorm
- [AWS Toolkit for VS Code](https://github.com/aws/aws-toolkit-vscode) - Visual Studio Code
- [AWS Toolkit for Visual Studio](https://github.com/aws/aws-toolkit-visual-studio) - Visual Studio

### Documentation

- [Telemetry System Documentation](telemetry/README.md)
- [Telemetry Format Specification](telemetry/telemetryformat.md)
- [Telemetry JSON Schema](telemetry/telemetrySchema.json)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for information on reporting security issues.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct). 
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact 
opensource-codeofconduct@amazon.com with any additional questions or comments.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.
