/**
 * Pattern 3 – Suppressing Error Toasts with meta.suppressErrorNotification
 *
 * When you want to render error UI inline (instead of relying on the global
 * toast), set `meta.suppressErrorNotification` to `true` and handle the
 * `error` value directly in your component.
 *
 * @see BEST_PRACTICES_REACT_QUERY_HOOKS.md – "Suppressing Error Toasts"
 */

import React from 'react';
import { kirowebportalservice } from '../hooks';

const SuppressedErrorExample: React.FC = () => {
  const { data, isLoading, error } = kirowebportalservice.useGetUserUsageAndLimits({
    region: 'us-east-1',
    input: {
      isEmailRequired: true,
      origin: 'WEB',
    },
    options: {
      meta: {
        // Suppress the default error toast – we handle errors ourselves.
        suppressErrorNotification: true,
      },
    },
  });

  if (isLoading) {
    return <div className="loader">Loading…</div>;
  }

  // Render a custom inline error banner instead of the global toast.
  if (error) {
    return (
      <div className="inline-error" role="alert">
        <h3>Unable to load usage data</h3>
        <p>{error.message}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="usage-card">
      <h2>Usage (suppressed toasts)</h2>
      {data && (
        <p>
          {data.currentUsage} / {data.usageLimit} – {data.planName}
        </p>
      )}
    </div>
  );
};

export default SuppressedErrorExample;
