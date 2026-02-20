/**
 * Pattern 1 – Basic Query Usage
 *
 * Demonstrates the simplest way to call a query hook:
 *   1. Pass `region` and `input` to the hook.
 *   2. Handle the three states: loading, error, and data.
 *
 * @see BEST_PRACTICES_REACT_QUERY_HOOKS.md – "Basic Usage"
 */

import React from 'react';
import { kirowebportalservice } from '../hooks';

const BasicQueryExample: React.FC = () => {
  // Call the query hook with required region and input parameters.
  const { data, isLoading, error } = kirowebportalservice.useGetUserUsageAndLimits({
    region: 'us-east-1',
    input: {
      isEmailRequired: true,
      origin: 'WEB',
    },
  });

  // 1️⃣  Loading state – render a spinner / skeleton while fetching.
  if (isLoading) {
    return <div className="loader">Loading usage data…</div>;
  }

  // 2️⃣  Error state – show a user-friendly message.
  if (error) {
    return (
      <div className="error" role="alert">
        Something went wrong: {error.message}
      </div>
    );
  }

  // 3️⃣  Success state – render the data.
  return (
    <div className="usage-card">
      <h2>Usage & Limits</h2>
      {data && (
        <>
          <p>Plan: {data.planName}</p>
          <p>
            Usage: {data.currentUsage} / {data.usageLimit}
          </p>
          <p>Renewal: {data.renewalDate}</p>
          {data.email && <p>Email: {data.email}</p>}
        </>
      )}
    </div>
  );
};

export default BasicQueryExample;
