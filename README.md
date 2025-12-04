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

Once the definitions are added and validated, the generators will produce strongly-typed code in each target language. See the code examples below for usage patterns.

### Consuming Generators in IDE Extensions

Each IDE extension consumes the generators differently:

- **VS Code:** Install as npm dependency `@aws-toolkits/telemetry`
- **JetBrains:** Use Gradle composite builds during development
- **Visual Studio:** Run generator executable to produce C# code

See individual README files in each language directory for specific integration instructions:
- [vscode/README.md](telemetry/vscode/README.md)
- [jetbrains/README.md](telemetry/jetbrains/README.md)
- [csharp/README.md](telemetry/csharp/README.md)

## Code Examples

This section provides practical examples of how to work with the telemetry system components across different languages.

### Telemetry Event Definitions

Define metrics and types in JSON files located in `telemetry/definitions/`. Here are practical examples:

#### Example 1: Basic Service Interaction

```json
{
  "types": [
    {
      "name": "deploymentResult", 
      "type": "string",
      "allowedValues": ["Succeeded", "Failed", "Cancelled"],
      "description": "Result of a deployment operation"
    },
    {
      "name": "serviceType",
      "type": "string", 
      "allowedValues": ["lambda", "s3", "dynamodb", "apigateway"],
      "description": "AWS service being interacted with"
    }
  ],
  "metrics": [
    {
      "name": "aws_deployService",
      "description": "Deploy an AWS service resource", 
      "unit": "None",
      "passive": false,
      "metadata": [
        { "type": "serviceType" },
        { "type": "deploymentResult" },
        { "type": "duration" }
      ]
    }
  ]
}
```

#### Example 2: Complex Metadata Types

```json
{
  "types": [
    {
      "name": "codeQualityScore",
      "type": "int",
      "description": "Code quality score from 0-100"
    },
    {
      "name": "featureFlag",
      "type": "boolean", 
      "description": "Whether a feature flag is enabled"
    },
    {
      "name": "requestLatency",
      "type": "double",
      "description": "Request latency in milliseconds"
    }
  ],
  "metrics": [
    {
      "name": "codeanalysis_scan",
      "description": "Performed code analysis scan",
      "unit": "Milliseconds",
      "passive": false,
      "metadata": [
        { "type": "codeQualityScore" },
        { "type": "featureFlag", "required": false },
        { "type": "requestLatency" }
      ]
    }
  ]
}
```

### TypeScript Integration (VS Code)

The TypeScript generator creates strongly-typed interfaces and a telemetry client. Here's how to use it:

#### Generated Types Example

```typescript
// Generated from the definitions above
export interface AwsDeployservice extends MetricBase {
  /** AWS service being interacted with */
  readonly serviceType: ServiceType
  /** Result of a deployment operation */  
  readonly deploymentResult: DeploymentResult
  /** Duration of the operation in milliseconds */
  readonly duration?: number
}

export type ServiceType = 'lambda' | 's3' | 'dynamodb' | 'apigateway'
export type DeploymentResult = 'Succeeded' | 'Failed' | 'Cancelled'

export interface CodeanalysisScan extends MetricBase {
  /** Code quality score from 0-100 */
  readonly codeQualityScore: number
  /** Whether a feature flag is enabled */
  readonly featureFlag?: boolean
  /** Request latency in milliseconds */
  readonly requestLatency: number
}
```

#### Recording Telemetry Events

```typescript
import { telemetry } from '@aws-toolkits/telemetry'

// Method 1: Simple event emission
telemetry.aws_deployService.emit({
  serviceType: 'lambda',
  deploymentResult: 'Succeeded',
  duration: 1500,
  awsRegion: 'us-west-2'
})

// Method 2: Using the run() method for automatic timing
const result = await telemetry.aws_deployService.run(async (span) => {
  try {
    // Your deployment logic here
    const deployResult = await deployLambdaFunction()
    
    // Record additional data during execution
    span.record({
      serviceType: 'lambda',
      deploymentResult: 'Succeeded'
    })
    
    return deployResult
  } catch (error) {
    // Record failure
    span.record({
      serviceType: 'lambda', 
      deploymentResult: 'Failed',
      reason: 'DeploymentError'
    })
    throw error
  }
})

// Method 3: Complex analysis with multiple metadata
async function performCodeAnalysis() {
  const startTime = Date.now()
  
  try {
    const analysisResults = await runCodeScan()
    const duration = Date.now() - startTime
    
    telemetry.codeanalysis_scan.emit({
      codeQualityScore: analysisResults.score,
      featureFlag: isNewAnalysisEnabled(),
      requestLatency: duration,
      result: 'Succeeded',
      awsAccount: getCurrentAccount(),
      duration: duration
    })
    
    return analysisResults
  } catch (error) {
    telemetry.codeanalysis_scan.emit({
      codeQualityScore: 0,
      requestLatency: Date.now() - startTime,
      result: 'Failed', 
      reason: error.name,
      reasonDesc: error.message?.substring(0, 200)
    })
    throw error
  }
}
```

#### Using with VS Code Extensions

```typescript
import * as vscode from 'vscode'
import { telemetry } from '@aws-toolkits/telemetry'

class AwsServiceProvider {
  async deployResource(serviceType: string): Promise<void> {
    // Track deployment attempts
    return telemetry.aws_deployService.run(async (span) => {
      const startTime = Date.now()
      
      try {
        // Show progress to user
        await vscode.window.withProgress({
          location: vscode.ProgressLocation.Notification,
          title: `Deploying ${serviceType} resource...`
        }, async (progress) => {
          
          // Simulate deployment steps
          progress.report({ increment: 25, message: "Validating configuration..." })
          await this.validateConfig()
          
          progress.report({ increment: 50, message: "Creating resources..." })
          await this.createResources(serviceType)
          
          progress.report({ increment: 100, message: "Deployment complete!" })
        })
        
        // Record successful deployment
        span.record({
          serviceType: serviceType as ServiceType,
          deploymentResult: 'Succeeded'
        })
        
      } catch (error) {
        // Record failure with context
        span.record({
          serviceType: serviceType as ServiceType, 
          deploymentResult: 'Failed',
          reason: error instanceof Error ? error.name : 'UnknownError'
        })
        
        vscode.window.showErrorMessage(`Deployment failed: ${error.message}`)
        throw error
      }
    })
  }
  
  private async validateConfig(): Promise<void> { /* ... */ }
  private async createResources(type: string): Promise<void> { /* ... */ }
}
```

### Kotlin Integration (JetBrains)

The Kotlin generator creates functions that integrate with JetBrains' telemetry infrastructure:

#### Generated Function Examples

```kotlin
// Generated from the same definitions
object AwsTelemetry {
    /**
     * Deploy an AWS service resource
     */
    fun deployService(
        project: Project?,
        serviceType: ServiceType,
        deploymentResult: DeploymentResult,
        duration: Double? = null,
        passive: Boolean = false,
        value: Double = 1.0,
        createTime: Instant = Instant.now(),
    ) {
        TelemetryService.getInstance().record(project) {
            datum("aws_deployService") {
                createTime(createTime)
                unit(MetricUnit.NONE)
                value(value)
                passive(passive)
                metadata("serviceType", serviceType.toString())
                metadata("deploymentResult", deploymentResult.toString())
                if (duration != null) {
                    metadata("duration", duration.toString())
                }
            }
        }
    }
    
    // Overload with ConnectionSettings
    fun deployService(
        connectionSettings: ConnectionSettings? = null,
        serviceType: ServiceType, 
        deploymentResult: DeploymentResult,
        duration: Double? = null,
        passive: Boolean = false,
        value: Double = 1.0,
        createTime: Instant = Instant.now(),
    ) { /* Similar implementation */ }
}

enum class ServiceType { LAMBDA, S3, DYNAMODB, APIGATEWAY }
enum class DeploymentResult { SUCCEEDED, FAILED, CANCELLED }
```

#### Usage in JetBrains Plugins

```kotlin
import com.intellij.openapi.project.Project
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.Task
import software.aws.toolkits.telemetry.AwsTelemetry
import software.aws.toolkits.telemetry.ServiceType
import software.aws.toolkits.telemetry.DeploymentResult
import java.time.Instant

class AwsDeploymentService {
    
    fun deployLambdaFunction(project: Project, functionName: String) {
        object : Task.Backgroundable(project, "Deploying Lambda Function", true) {
            override fun run(indicator: ProgressIndicator) {
                val startTime = Instant.now()
                
                try {
                    indicator.text = "Validating Lambda configuration..."
                    validateLambdaConfig(functionName)
                    
                    indicator.text = "Creating Lambda function..."
                    createLambdaFunction(functionName)
                    
                    indicator.text = "Deployment complete"
                    
                    // Record successful deployment
                    AwsTelemetry.deployService(
                        project = project,
                        serviceType = ServiceType.LAMBDA,
                        deploymentResult = DeploymentResult.SUCCEEDED,
                        duration = Duration.between(startTime, Instant.now()).toMillis().toDouble()
                    )
                    
                } catch (e: Exception) {
                    // Record failure
                    AwsTelemetry.deployService(
                        project = project,
                        serviceType = ServiceType.LAMBDA, 
                        deploymentResult = DeploymentResult.FAILED,
                        duration = Duration.between(startTime, Instant.now()).toMillis().toDouble()
                    )
                    
                    throw e
                }
            }
        }.queue()
    }
    
    private fun validateLambdaConfig(name: String) { /* ... */ }
    private fun createLambdaFunction(name: String) { /* ... */ }
}
```

#### Integration with IntelliJ Actions

```kotlin
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages
import software.aws.toolkits.telemetry.AwsTelemetry

class DeployToS3Action : AnAction("Deploy to S3") {
    
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        
        val startTime = System.currentTimeMillis()
        
        try {
            // Perform S3 deployment
            val bucketName = Messages.showInputDialog(
                project,
                "Enter S3 bucket name:",
                "Deploy to S3", 
                Messages.getQuestionIcon()
            ) ?: return
            
            deployToS3(bucketName)
            
            // Record successful deployment
            AwsTelemetry.deployService(
                project = project,
                serviceType = ServiceType.S3,
                deploymentResult = DeploymentResult.SUCCEEDED,
                duration = (System.currentTimeMillis() - startTime).toDouble()
            )
            
            Messages.showInfoMessage(project, "Successfully deployed to S3!", "Deployment Complete")
            
        } catch (e: Exception) {
            // Record failure
            AwsTelemetry.deployService(
                project = project,
                serviceType = ServiceType.S3,
                deploymentResult = DeploymentResult.FAILED, 
                duration = (System.currentTimeMillis() - startTime).toDouble()
            )
            
            Messages.showErrorDialog(project, "Deployment failed: ${e.message}", "Deployment Error")
        }
    }
    
    private fun deployToS3(bucketName: String) {
        // S3 deployment logic
    }
}
```

### C# Integration (Visual Studio)

The C# generator creates classes that integrate with Visual Studio's telemetry system:

#### Generated Class Examples

```csharp
// Generated from the same definitions
namespace Amazon.AwsToolkit.Telemetry.Events
{
    public class AwsDeployServiceEvent : TelemetryEventBase
    {
        public ServiceType ServiceType { get; set; }
        public DeploymentResult DeploymentResult { get; set; }
        public double? Duration { get; set; }
        
        public override string EventName => "aws_deployService";
        public override string Description => "Deploy an AWS service resource";
    }
    
    public enum ServiceType 
    {
        Lambda,
        S3, 
        DynamoDB,
        ApiGateway
    }
    
    public enum DeploymentResult
    {
        Succeeded,
        Failed, 
        Cancelled
    }
}
```

#### Usage in Visual Studio Extensions

```csharp
using Amazon.AwsToolkit.Telemetry.Events;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Threading;
using System;
using System.Threading.Tasks;

public class AwsDeploymentManager
{
    private readonly ITelemetryService _telemetryService;
    
    public AwsDeploymentManager(ITelemetryService telemetryService)
    {
        _telemetryService = telemetryService;
    }
    
    public async Task DeployLambdaFunctionAsync(string functionName)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        try
        {
            // Show progress in Visual Studio
            await ThreadHelper.JoinableTaskFactory.RunAsync(async delegate
            {
                await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
                
                // Update status bar
                var statusBar = await ServiceProvider.GetGlobalServiceAsync(typeof(IVsStatusbar)) as IVsStatusbar;
                statusBar?.SetText("Deploying Lambda function...");
            });
            
            // Perform deployment
            await ValidateFunctionConfigAsync(functionName);
            await CreateLambdaResourceAsync(functionName);
            
            stopwatch.Stop();
            
            // Record successful deployment
            _telemetryService.RecordEvent(new AwsDeployServiceEvent
            {
                ServiceType = ServiceType.Lambda,
                DeploymentResult = DeploymentResult.Succeeded,
                Duration = stopwatch.ElapsedMilliseconds,
                AwsRegion = GetCurrentRegion(),
                AwsAccount = GetCurrentAccount()
            });
            
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            // Record failure
            _telemetryService.RecordEvent(new AwsDeployServiceEvent
            {
                ServiceType = ServiceType.Lambda,
                DeploymentResult = DeploymentResult.Failed,
                Duration = stopwatch.ElapsedMilliseconds,
                Reason = ex.GetType().Name,
                ReasonDesc = ex.Message?.Substring(0, Math.Min(200, ex.Message.Length))
            });
            
            throw;
        }
    }
    
    private async Task ValidateFunctionConfigAsync(string name) { /* ... */ }
    private async Task CreateLambdaResourceAsync(string name) { /* ... */ }
    private string GetCurrentRegion() { /* ... */ }
    private string GetCurrentAccount() { /* ... */ }
}
```

#### Visual Studio Command Integration

```csharp
[Command(PackageIds.DeployToAwsCommand)]
internal sealed class DeployToAwsCommand : BaseCommand<DeployToAwsCommand>
{
    private readonly ITelemetryService _telemetryService;
    
    public DeployToAwsCommand(ITelemetryService telemetryService)
    {
        _telemetryService = telemetryService;
    }
    
    protected override async Task ExecuteAsync(OleMenuCmdEventArgs e)
    {
        var startTime = DateTime.UtcNow;
        
        try
        {
            // Get user selection
            var serviceType = await GetServiceTypeFromUserAsync();
            var resourceName = await GetResourceNameAsync();
            
            // Perform deployment based on service type
            switch (serviceType)
            {
                case ServiceType.Lambda:
                    await DeployLambdaAsync(resourceName);
                    break;
                case ServiceType.S3:
                    await DeployS3ResourceAsync(resourceName);
                    break;
                // ... other cases
            }
            
            // Record successful deployment
            _telemetryService.RecordEvent(new AwsDeployServiceEvent
            {
                ServiceType = serviceType,
                DeploymentResult = DeploymentResult.Succeeded,
                Duration = (DateTime.UtcNow - startTime).TotalMilliseconds
            });
            
            await ShowInfoMessageAsync("Deployment completed successfully!");
            
        }
        catch (OperationCanceledException)
        {
            // User cancelled - record as cancelled
            _telemetryService.RecordEvent(new AwsDeployServiceEvent
            {
                ServiceType = ServiceType.Lambda, // Default or last known
                DeploymentResult = DeploymentResult.Cancelled,
                Duration = (DateTime.UtcNow - startTime).TotalMilliseconds
            });
        }
        catch (Exception ex)
        {
            // Record failure
            _telemetryService.RecordEvent(new AwsDeployServiceEvent
            {
                ServiceType = ServiceType.Lambda, // Default or last known
                DeploymentResult = DeploymentResult.Failed,
                Duration = (DateTime.UtcNow - startTime).TotalMilliseconds,
                Reason = ex.GetType().Name
            });
            
            await ShowErrorMessageAsync($"Deployment failed: {ex.Message}");
        }
    }
    
    private async Task<ServiceType> GetServiceTypeFromUserAsync() { /* ... */ }
    private async Task<string> GetResourceNameAsync() { /* ... */ }
}
```

### Shared Component Usage Patterns

#### Pattern 1: Operation Tracking with Result Handling

```typescript
// TypeScript pattern for consistent error handling
async function trackAwsOperation<T>(
  operation: () => Promise<T>,
  metric: any,
  context: { serviceType: string, operationType: string }
): Promise<T> {
  return metric.run(async (span) => {
    try {
      const result = await operation()
      span.record({
        ...context,
        result: 'Succeeded'
      })
      return result
    } catch (error) {
      span.record({
        ...context,
        result: 'Failed',
        reason: error.name
      })
      throw error
    }
  })
}

// Usage
const lambdaResult = await trackAwsOperation(
  () => deployLambdaFunction(),
  telemetry.aws_deployService,
  { serviceType: 'lambda', operationType: 'deploy' }
)
```

#### Pattern 2: Feature Flag Integration

```kotlin
// Kotlin pattern for feature flag telemetry
class FeatureManager {
    fun executeWithFeatureTracking(
        project: Project,
        featureName: String,
        action: () -> Unit
    ) {
        val isEnabled = isFeatureEnabled(featureName)
        
        try {
            if (isEnabled) {
                action()
            }
            
            // Record feature usage
            telemetry.feature_usage.emit(
                project = project,
                featureName = featureName,
                enabled = isEnabled,
                result = "Succeeded"
            )
            
        } catch (e: Exception) {
            telemetry.feature_usage.emit(
                project = project,
                featureName = featureName,
                enabled = isEnabled,
                result = "Failed"
            )
            throw e
        }
    }
}
```

#### Pattern 3: Performance Monitoring

```csharp
// C# pattern for performance monitoring
public class PerformanceTracker
{
    private readonly ITelemetryService _telemetryService;
    
    public async Task<T> TrackPerformanceAsync<T>(
        string operationName,
        Func<Task<T>> operation,
        Dictionary<string, object> metadata = null)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var result = await operation();
            stopwatch.Stop();
            
            _telemetryService.RecordEvent(new PerformanceEvent
            {
                OperationName = operationName,
                Duration = stopwatch.ElapsedMilliseconds,
                Result = "Succeeded",
                Metadata = metadata ?? new Dictionary<string, object>()
            });
            
            return result;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            _telemetryService.RecordEvent(new PerformanceEvent
            {
                OperationName = operationName,
                Duration = stopwatch.ElapsedMilliseconds,
                Result = "Failed",
                Reason = ex.GetType().Name,
                Metadata = metadata ?? new Dictionary<string, object>()
            });
            
            throw;
        }
    }
}
```

These examples demonstrate the practical usage patterns of the AWS Toolkit Common telemetry system across all three supported languages, showing how the generated code integrates seamlessly with each IDE's development workflow.

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
