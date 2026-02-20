/**
 * Mock hook declarations that mirror the API surface of `@amzn/kiro-web-sdk-hooks`.
 *
 * In a real project these hooks are auto-generated from the service model.
 * Here we provide typed stubs so the example components can type-check
 * without the actual SDK package.
 */

import type {
  QueryHookParams,
  QueryHookResult,
  MutationHookParams,
  MutationHookResult,
  GetUserUsageAndLimitsInput,
  UserUsageAndLimits,
  CreateInstanceInput,
  CreateInstanceOutput,
} from './types';

// ---------------------------------------------------------------------------
// kirowebportalservice – query hooks
// ---------------------------------------------------------------------------

export const kirowebportalservice = {
  /**
   * Fetches the current user's usage statistics and plan limits.
   *
   * @example
   * ```ts
   * const { data, isLoading, error } = kirowebportalservice.useGetUserUsageAndLimits({
   *   region: 'us-east-1',
   *   input: { isEmailRequired: true, origin: 'WEB' },
   * });
   * ```
   */
  useGetUserUsageAndLimits(
    _params: QueryHookParams<GetUserUsageAndLimitsInput>,
  ): QueryHookResult<UserUsageAndLimits> {
    // Stub – the real implementation is provided by the SDK at runtime.
    return { data: undefined, isLoading: true, error: null };
  },
};

// ---------------------------------------------------------------------------
// bigweaver – mutation hooks
// ---------------------------------------------------------------------------

export const bigweaver = {
  /**
   * Returns a mutation function for creating a new compute instance.
   *
   * @example
   * ```ts
   * const createInstance = bigweaver.useCreateInstanceFn({});
   * createInstance.mutate(input, { onSuccess: (data) => {} });
   * ```
   */
  useCreateInstanceFn(
    _params: MutationHookParams,
  ): MutationHookResult<CreateInstanceInput, CreateInstanceOutput> {
    // Stub – the real implementation is provided by the SDK at runtime.
    const noop = () => {};
    return {
      mutate: noop as MutationHookResult<CreateInstanceInput, CreateInstanceOutput>['mutate'],
      mutateAsync: (() =>
        Promise.resolve({} as CreateInstanceOutput)) as MutationHookResult<
        CreateInstanceInput,
        CreateInstanceOutput
      >['mutateAsync'],
      isLoading: false,
      data: undefined,
      error: null,
    };
  },
};
