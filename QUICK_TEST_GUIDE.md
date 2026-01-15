# Quick Test Execution Guide

## Overview
This guide provides commands to quickly run all the new tests added to the aws-toolkit-common repository.

## Prerequisites
- Node.js (for TypeScript tests)
- Java/Gradle (for Kotlin tests)  
- .NET SDK (for C# tests)

---

## TypeScript/VSCode Tests

### Location: `/telemetry/vscode`

```bash
cd /projects/sandbox/aws-toolkit-common/telemetry/vscode

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run specific new test files
npm test -- generateHelpers.test.ts
npm test -- parserEdgeCases.test.ts

# Run with coverage
npm test -- --coverage

# Expected new tests:
# - generateHelpers.test.ts: ~29 tests
# - parserEdgeCases.test.ts: ~31 tests
```

---

## TypeScript/Validation Tests

### Location: `/telemetry/validation`

```bash
cd /projects/sandbox/aws-toolkit-common/telemetry/validation

# Install dependencies (if not already done)
npm install

# Build TypeScript
npm run build

# Run all tests
npm test

# Run specific new test file
npm test -- fileOperations.test

# Expected new tests:
# - fileOperations.test.ts: ~14 tests
```

---

## Kotlin/JetBrains Tests

### Location: `/telemetry/jetbrains`

```bash
cd /projects/sandbox/aws-toolkit-common/telemetry/jetbrains

# Run all tests
./gradlew test

# Run specific new test files
./gradlew test --tests ResourceLoaderTest
./gradlew test --tests StringExtensionsTest

# Generate test report (in build/reports/tests/test/index.html)
./gradlew test

# Expected new tests:
# - ResourceLoaderTest: ~11 tests
# - StringExtensionsTest: ~35 tests
```

---

## C# Tests

### Location: `/telemetry/csharp`

```bash
cd /projects/sandbox/aws-toolkit-common/telemetry/csharp

# Run all tests
dotnet test

# Run specific test projects
dotnet test AwsToolkit.Telemetry.Events.Generator.Tests/AwsToolkit.Telemetry.Events.Generator.Tests.csproj
dotnet test AwsToolkit.Telemetry.Events.Tests/AwsToolkit.Telemetry.Events.Tests.csproj

# Run specific test class
dotnet test --filter "FullyQualifiedName~MetricTypeExtensionMethodsTests"
dotnet test --filter "FullyQualifiedName~MetricDatumTests"

# Generate coverage report
dotnet test /p:CollectCoverage=true /p:CoverageReportFormat=lcov

# Expected new tests:
# - MetricTypeExtensionMethodsTests: ~28 tests
# - MetricDatumTests: ~17 tests
```

---

## Run All Tests at Once

### Bash Script to Run All Tests

```bash
#!/bin/bash

echo "=== Running TypeScript/VSCode Tests ==="
cd /projects/sandbox/aws-toolkit-common/telemetry/vscode
npm install && npm test

echo ""
echo "=== Running TypeScript/Validation Tests ==="
cd /projects/sandbox/aws-toolkit-common/telemetry/validation
npm install && npm run build && npm test

echo ""
echo "=== Running Kotlin/JetBrains Tests ==="
cd /projects/sandbox/aws-toolkit-common/telemetry/jetbrains
./gradlew test

echo ""
echo "=== Running C# Tests ==="
cd /projects/sandbox/aws-toolkit-common/telemetry/csharp
dotnet test

echo ""
echo "=== All Tests Complete ==="
```

Save this as `run-all-tests.sh` in the repository root and execute with:
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

## Expected Test Results

### New Tests Summary
- **TypeScript VSCode**: ~60 new tests
- **TypeScript Validation**: ~14 new tests
- **Kotlin**: ~46 new tests
- **C#**: ~45 new tests
- **Total**: ~165 new tests

### Test Files Added
1. `telemetry/vscode/test/generateHelpers.test.ts`
2. `telemetry/vscode/test/parserEdgeCases.test.ts`
3. `telemetry/validation/src/fileOperations.test.ts`
4. `telemetry/jetbrains/src/test/kotlin/.../ResourceLoaderTest.kt`
5. `telemetry/jetbrains/src/test/kotlin/.../StringExtensionsTest.kt`
6. `telemetry/csharp/.../MetricTypeExtensionMethodsTests.cs`
7. `telemetry/csharp/.../MetricDatumTests.cs`

---

## Troubleshooting

### TypeScript: "Cannot find module"
```bash
cd telemetry/vscode  # or validation
npm install
npm run build
```

### Kotlin: "Task 'test' not found"
```bash
# Use gradlew from the jetbrains directory
cd telemetry/jetbrains
./gradlew test
```

### C#: "No test is available"
```bash
# Restore dependencies
cd telemetry/csharp
dotnet restore
dotnet build
dotnet test
```

### Jest: Tests in wrong location
The validation tests compile to `dist/` folder. Make sure to run `npm run build` first:
```bash
cd telemetry/validation
npm run build
npm test
```

---

## Viewing Test Results

### TypeScript (Jest)
- Console output shows pass/fail
- Coverage reports in `coverage/` directory
- Use `npm test -- --verbose` for detailed output

### Kotlin (JUnit)
- Test report: `build/reports/tests/test/index.html`
- Open in browser to view detailed results
- Console shows summary

### C# (xUnit)
- Console output shows pass/fail
- Use `--logger "console;verbosity=detailed"` for more info
- Coverage reports generated with CollectCoverage option

---

## CI/CD Integration

To integrate these tests into CI/CD pipelines:

### GitHub Actions Example
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test-typescript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Test VSCode
        run: |
          cd telemetry/vscode
          npm install
          npm test
      - name: Test Validation
        run: |
          cd telemetry/validation
          npm install
          npm run build
          npm test

  test-kotlin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
      - name: Test JetBrains
        run: |
          cd telemetry/jetbrains
          ./gradlew test

  test-csharp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-dotnet@v2
      - name: Test C#
        run: |
          cd telemetry/csharp
          dotnet test
```

---

## Next Steps

After running tests:
1. ✅ Verify all new tests pass
2. ✅ Review test coverage reports
3. ✅ Integrate into CI/CD pipeline
4. ✅ Document any failures or issues
5. ✅ Update tests as code evolves

For detailed analysis of test coverage, see `TEST_COVERAGE_ANALYSIS.md`.
