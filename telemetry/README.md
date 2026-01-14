# Telemetry

`telemetry` contains code generators and definitions files to generate telemetry calls for the various
AWS IDE Extensions.

## Adding Telemetry

### Where to Edit

#### VS Code

For prototyping telemetry, modify the `src/shared/telemetry/vscodeTelemetry.json` inside the toolkit repository.

Make changes in that file, then from the AWS Toolkit repo root run:

`npm run generateTelemetry`

To update the generated output. When you are satisfied with generated telemetry, move
the definitions you just added to the appropriate file in `definitions` in this repo.

Edits to the generator files are made in this repo located in `telemetry/vscode/src/`.
You can manually run your changes by first building `npm run prepack` and then modifying the dev dependency inside the AWS Toolkit repo `package.json` file:

`"@aws-toolkits/telemetry": "file:/path/to/built/dependency"`

To generate telemetry run `npm run generateTelemetry` from the AWS Toolkit repo.

#### JetBrains

By using Gradle composite builds, we can prototype telemetry for the JetBrains toolkit directly in this repository.

Make changes to the appropriate file in `definitions` in this repository, then from the toolkit directory run:

`./gradlew generateTelemetry --include-build <path/to/aws-toolkit-common>/telemetry/jetbrains`

Your changes should then be reflected in the generated output.

#### Java

For Java projects, you can use the telemetry generator by adding it as a dependency in your build configuration. The generator works with both Gradle and Maven projects.

**Gradle Configuration**

Add the following to your `build.gradle` or `build.gradle.kts`:

```gradle
// In build.gradle
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'software.aws.toolkits:telemetry-generator:1.0'
    }
}

// Import the task type
import software.aws.toolkits.telemetry.generator.gradle.GenerateTelemetry

// Define the telemetry generation task
task generateTelemetry(type: GenerateTelemetry) {
    inputFiles = [file('path/to/telemetry-definitions.json')]
    outputDirectory = file('src/main/java/com/example/telemetry')
}

// Make compilation depend on telemetry generation
compileJava.dependsOn(generateTelemetry)
```

**Maven Configuration**

For Maven projects, you can use the exec-maven-plugin to run the generator:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>3.1.0</version>
            <executions>
                <execution>
                    <id>generate-telemetry</id>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>java</goal>
                    </goals>
                    <configuration>
                        <mainClass>software.aws.toolkits.telemetry.generator.TelemetryGenerator</mainClass>
                        <arguments>
                            <argument>--input</argument>
                            <argument>${project.basedir}/src/main/resources/telemetry-definitions.json</argument>
                            <argument>--output</argument>
                            <argument>${project.build.directory}/generated-sources/telemetry</argument>
                        </arguments>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

**Using Generated Telemetry in Java Code**

Once generated, you can use the telemetry in your Java application:

```java
import software.aws.toolkits.telemetry.TelemetryPublisher;
import software.aws.toolkits.telemetry.events.*;

public class MyApplication {
    private final TelemetryPublisher telemetry;
    
    public MyApplication(TelemetryPublisher telemetry) {
        this.telemetry = telemetry;
    }
    
    public void performAction() {
        // Record a telemetry event
        telemetry.record(
            LambdaInvoke.builder()
                .result(Result.SUCCEEDED)
                .duration(1234.0)
                .build()
        );
    }
}
```

For prototyping, make changes to the appropriate file in `definitions` in this repository, then regenerate the telemetry code using the build tool commands above.

#### Visual Studio

For prototyping telemetry, and to define product-specific metrics, modify `toolkitcore\AWSToolkit.Util\Telemetry\vs-telemetry-definitions.json` inside the toolkit repository. These are known as Supplemental Telemetry definitions, and you can read more about this [here](csharp/README.md).

After changing the file, you'll need to build the generator from this repo. Then you'll use the generator as follows to update the generated supplemental telemetry code:

```
Amazon.AwsToolkit.Telemetry.Events.Generator.exe -s <VS_TOOLKIT_REPO_ROOT>\toolkitcore\AWSToolkit.Util\Telemetry\vs-telemetry-definitions.json -o <VS_TOOLKIT_REPO_ROOT>\toolkitcore\AWSToolkit.Util\Telemetry -f ToolkitTelemetryEvents.generated.cs
```

Commit the json and cs files to the VS Toolkit repo as needed.

### How to Edit

The easiest way to edit telemetry is to copy existing telemetry and change the values. For example,
to add a piece of metadata that is best represented by a string based enum, take an existing type:

```json
{
    "name": "schemaLanguage",
    "type": "string",
    "allowedValues": ["Java8", "Python36", "TypeScript3"],
    "description": "Languages targeted by the schemas service"
}
```

and change `name`, `description`, and the values in `allowedValues`

```json
{
    "name": "veryImportantInformation",
    "type": "string",
    "allowedValues": ["yes", "no", "maybe"],
    "description": "This description is generated into doc comments so make it count"
}
```

Then rerun the generator. This example will generate a new type that can be imported or used in telemetry calls.

CI jobs run validation checks on the telemetry definitions file. For example, entries are expected to exist in alphabetical order. You may want to check this yourself before creating a PR, by switching to the `telemetry/validation` folder, and running:

```
npm install
npm run validate
```

You can also run `npm run fix` to apply simple fixes to the file (like re-ordering).

### Overriding existing telemetry

In VSCode and JetBrains, extra telemetry files will take precedence over existing definitions. For example, if you have a metric for `lambda_update`, adding another `lambda_update` in the repo's extra telemetry files will override all of the values of it.

Types work similarly, and will also be overwritten by extra telemetry files.

### Editing in IDE

The telemetry format comes with a json schema document [here](telemetrySchema.json) that can be loaded
into the IDE while editing the documents. This will give you feedback as you edit.

-   [VS Code Instructions](https://code.visualstudio.com/docs/languages/json#_mapping-to-a-schema-in-the-workspace)
-   [JetBrains Instructions](https://www.jetbrains.com/help/idea/json.html#ws_json_schema_add_custom)

### Format Specification

See the [telemetry format document](telemetryformat.md) for complete format specification, or the
[json schema](telemetrySchema.json)

## Consuming Generators

For specifics on how to consume the generators, see each language/IDE specific doc:

-   [TypeScript/VS Code](vscode/README.md)
-   [Kotlin/JetBrains](jetbrains/README.md)
-   [Java](jetbrains/README.md) - Java projects can use the JetBrains/Kotlin generator, which produces JVM-compatible code
-   [C#/Visual Studio](csharp/README.md)
