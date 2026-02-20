/**
 * Advanced Example – Combining Queries and Mutations
 *
 * A realistic component that:
 *   1. Fetches usage data with a custom error message (query).
 *   2. Lets the user create an instance (mutation) only when under the limit.
 *   3. Handles loading, error, and success states for both operations.
 *
 * This showcases how multiple SDK hook patterns work together in practice.
 *
 * @see BEST_PRACTICES_REACT_QUERY_HOOKS.md
 */

import React, { useState } from 'react';
import { kirowebportalservice, bigweaver } from '../hooks';
import type { CreateInstanceInput } from '../types';

const AdvancedExample: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  // ── Query: fetch user usage with a custom error message ──────────────
  const {
    data: usage,
    isLoading: usageLoading,
    error: usageError,
  } = kirowebportalservice.useGetUserUsageAndLimits({
    region: 'us-east-1',
    input: {
      isEmailRequired: true,
      origin: 'WEB',
    },
    options: {
      meta: {
        getErrorMessage: (error: unknown) => {
          if (error instanceof Error) {
            return `Unable to fetch usage: ${error.message}`;
          }
          return 'Unable to fetch usage. Please try again later.';
        },
      },
    },
  });

  // ── Mutation: create an instance with suppressed toasts ──────────────
  const createInstance = bigweaver.useCreateInstanceFn({
    options: {
      meta: { suppressErrorNotification: true },
    },
  });

  const handleCreate = () => {
    const input: CreateInstanceInput = {
      instanceName: 'auto-instance',
      instanceType: 't3.micro',
      region: 'us-east-1',
    };

    createInstance.mutate(input, {
      onSuccess: (data) => {
        setMessage(`Created ${data.instanceName} (${data.instanceId}) – ${data.status}`);
      },
      onError: (error) => {
        setMessage(`Creation failed: ${error.message}`);
      },
    });
  };

  // ── Render ───────────────────────────────────────────────────────────

  if (usageLoading) {
    return <div className="loader">Loading dashboard…</div>;
  }

  if (usageError) {
    return (
      <div className="error" role="alert">
        {usageError.message}
      </div>
    );
  }

  const isOverLimit = usage ? usage.currentUsage >= usage.usageLimit : false;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {usage && (
        <section className="usage-summary">
          <p>Plan: {usage.planName}</p>
          <p>
            Usage: {usage.currentUsage} / {usage.usageLimit}
          </p>
          <p>Renewal: {usage.renewalDate}</p>
        </section>
      )}

      <section className="actions">
        <button type="button" onClick={handleCreate} disabled={createInstance.isLoading || isOverLimit}>
          {createInstance.isLoading ? 'Creating…' : 'Create Instance'}
        </button>

        {isOverLimit && <p className="warning">You have reached your usage limit.</p>}
      </section>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdvancedExample;
