/**
 * Pattern 2 – Custom Error Messages via meta.getErrorMessage
 *
 * Shows how to provide a `getErrorMessage` function so the global QueryClient
 * can display a descriptive toast instead of a generic "Error" message.
 *
 * Guidelines:
 *   • Be specific – describe what action failed.
 *   • Be helpful – suggest next steps when possible.
 *   • Be concise – keep messages short and clear.
 *   • Handle all cases – always provide a fallback message.
 *
 * @see BEST_PRACTICES_REACT_QUERY_HOOKS.md – "Customizing Error Messages"
 */

import React from 'react';
import { kirowebportalservice } from '../hooks';

const CustomErrorMessageExample: React.FC = () => {
  const { data, isLoading, error } = kirowebportalservice.useGetUserUsageAndLimits({
    region: 'us-east-1',
    input: {
      isEmailRequired: true,
      origin: 'WEB',
    },
    options: {
      meta: {
        // Provide a human-readable message for the global error toast.
        getErrorMessage: (error: unknown) => {
          if (error instanceof Error) {
            return `Failed to load usage data: ${error.message}`;
          }
          return 'Failed to load usage data. Please try again later.';
        },
      },
    },
  });

  if (isLoading) {
    return <div className="loader">Loading…</div>;
  }

  if (error) {
    return (
      <div className="error" role="alert">
        {error.message}
      </div>
    );
  }

  return (
    <div className="usage-card">
      <h2>Usage (with custom error messages)</h2>
      {data && (
        <p>
          {data.currentUsage} / {data.usageLimit} – {data.planName}
        </p>
      )}
    </div>
  );
};

export default CustomErrorMessageExample;
