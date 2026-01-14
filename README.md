# AWS Toolkit Common

This repo contains shared components for the AWS Toolkits for

* [Jetbrains](https://github.com/aws/aws-toolkit-jetbrains)
* [VSCode](https://github.com/aws/aws-toolkit-vscode/)
* [Visual Studio](https://github.com/aws/aws-toolkit-visual-studio)

Contributers looking to contribute to the above projects should consult the contributing guide (CONTRIBUTING.md)
on the repos they are interested in: this repo contains internal components that most contributers would find boring.

## Components

### Telemetry

Telemetry is the first shared component in this repository. It provides code generators and definitions for generating telemetry calls across multiple languages and platforms:

* **Java** - Using Gradle or Maven build integration
* **Kotlin** - For JetBrains IDEs
* **TypeScript** - For VS Code extensions
* **C#** - For Visual Studio

[Read about telemetry here.](telemetry/README.md)

## License

This project is licensed under the Apache-2.0 License.
