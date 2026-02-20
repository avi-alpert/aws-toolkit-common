# SDK Hooks TypeScript Examples

Reference examples showing how to use `@amzn/kiro-web-sdk-hooks` following the patterns documented in **BEST_PRACTICES_REACT_QUERY_HOOKS.md**.

> **Note:** This is a type-check-only project. The code compiles against mock type stubs and is meant to be read as documentation — it does not run standalone.

## Examples

| File | Pattern | Description |
|------|---------|-------------|
| `BasicQueryExample.tsx` | Basic Query Usage | Minimal hook call with loading / error / data states |
| `CustomErrorMessageExample.tsx` | Custom Error Messages | Adds `meta.getErrorMessage` for descriptive toast messages |
| `SuppressedErrorExample.tsx` | Suppressed Error Toasts | Uses `meta.suppressErrorNotification` with inline error UI |
| `MutationExample.tsx` | Mutations with Callbacks | Form-driven mutation with `onSuccess` / `onError` callbacks |
| `AdvancedExample.tsx` | Combined Patterns | Query + mutation together in a dashboard component |

## Patterns Covered

### 1. Basic Query Usage (`BasicQueryExample.tsx`)

Call a query hook with `region` and `input`, then handle three render states:

```tsx
const { data, isLoading, error } = kirowebportalservice.useGetUserUsageAndLimits({
  region: 'us-east-1',
  input: { isEmailRequired: true, origin: 'WEB' },
});
```

### 2. Custom Error Messages (`CustomErrorMessageExample.tsx`)

Provide `meta.getErrorMessage` so the QueryClient shows a meaningful toast:

```tsx
options: {
  meta: {
    getErrorMessage: (error: unknown) => {
      if (error instanceof Error) {
        return `Failed to load usage data: ${error.message}`;
      }
      return 'Failed to load usage data. Please try again later.';
    },
  },
}
```

### 3. Suppressing Error Toasts (`SuppressedErrorExample.tsx`)

Suppress the global toast and render your own error UI:

```tsx
options: {
  meta: { suppressErrorNotification: true },
}
// then handle `error` inline in the component
```

### 4. Mutations with Callbacks (`MutationExample.tsx`)

Use a mutation hook with `onSuccess` / `onError`:

```tsx
const createInstance = bigweaver.useCreateInstanceFn({
  options: { meta: { suppressErrorNotification: true } },
});

createInstance.mutate(input, {
  onSuccess: (data) => { /* … */ },
  onError: (error) => { /* … */ },
});
```

### 5. Combined Patterns (`AdvancedExample.tsx`)

A dashboard that fetches usage data (query with custom error message) and creates instances (mutation with suppressed toasts and callbacks).

## Error Handling Flow

The QueryClient handles errors automatically:

| Error Type | Toast Color | Retry Behavior |
|------------|-------------|----------------|
| Auth (401/403) | Red – "Authentication Error" | No retries |
| Rate Limit (429) | Orange – "Rate Limit Exceeded" | Up to 5 retries (exponential backoff) |
| Other | Custom message from `meta.getErrorMessage` or generic | Up to 3 retries (exponential backoff) |

Mutations do **not** retry by default.

## Type-Checking

```bash
npm install
npx tsc --noEmit
```

## Project Structure

```
src/
  types.ts          – Mock type definitions (simulates @amzn/kiro-web-sdk-hooks types)
  hooks.ts          – Mock hook declarations (simulates @amzn/kiro-web-sdk-hooks exports)
  index.ts          – Re-exports all examples
  examples/
    BasicQueryExample.tsx
    CustomErrorMessageExample.tsx
    SuppressedErrorExample.tsx
    MutationExample.tsx
    AdvancedExample.tsx
```
