/**
 * Mock type definitions simulating the `@amzn/kiro-web-sdk-hooks` package.
 *
 * These types model the hook parameter and return shapes used across the SDK.
 * In a real project these would be generated from the service model and
 * exported by `@amzn/kiro-web-sdk-hooks`.
 */

// ---------------------------------------------------------------------------
// Meta / Options
// ---------------------------------------------------------------------------

/** Metadata that can be attached to any query or mutation via `options.meta`. */
export interface HookMeta {
  /**
   * Provide a user-friendly error message for toast notifications.
   * The QueryClient calls this when a request fails.
   */
  getErrorMessage?: (error: unknown) => string;

  /**
   * When `true` the default error toast is suppressed so the component can
   * render its own error UI.
   */
  suppressErrorNotification?: boolean;
}

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

/** Parameters accepted by query hooks (e.g. useGetUserUsageAndLimits). */
export interface QueryHookParams<TInput> {
  /** AWS region to target. */
  region: string;

  /** Service-specific input payload. */
  input: TInput;

  /** Optional React Query overrides. */
  options?: {
    meta?: HookMeta;
  };
}

/** Return value of a query hook. */
export interface QueryHookResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// Mutation types
// ---------------------------------------------------------------------------

/** Callbacks passed to `mutate()`. */
export interface MutateCallbacks<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

/** Parameters accepted by mutation hooks (e.g. useCreateInstanceFn). */
export interface MutationHookParams {
  options?: {
    meta?: HookMeta;
  };
}

/** Return value of a mutation hook. */
export interface MutationHookResult<TInput, TData> {
  mutate: (input: TInput, callbacks?: MutateCallbacks<TData>) => void;
  mutateAsync: (input: TInput) => Promise<TData>;
  isLoading: boolean;
  data: TData | undefined;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// Domain models
// ---------------------------------------------------------------------------

/** Input for the GetUserUsageAndLimits operation. */
export interface GetUserUsageAndLimitsInput {
  isEmailRequired: boolean;
  origin: string;
}

/** Output of the GetUserUsageAndLimits operation. */
export interface UserUsageAndLimits {
  email?: string;
  currentUsage: number;
  usageLimit: number;
  planName: string;
  renewalDate: string;
}

/** Input for the CreateInstance operation. */
export interface CreateInstanceInput {
  instanceName: string;
  instanceType: string;
  region: string;
}

/** Output of the CreateInstance operation. */
export interface CreateInstanceOutput {
  instanceId: string;
  instanceName: string;
  status: string;
  createdAt: string;
}
