/**
 * Pattern 4 – Mutations with Callbacks
 *
 * Demonstrates how to use a mutation hook (`useCreateInstanceFn`) with:
 *   • `meta.suppressErrorNotification` to handle errors locally.
 *   • `mutate()` callbacks (`onSuccess`, `onError`) for post-mutation logic.
 *
 * @see BEST_PRACTICES_REACT_QUERY_HOOKS.md – "Suppressing Error Toasts" (mutations)
 */

import React, { useState } from 'react';
import { bigweaver } from '../hooks';
import type { CreateInstanceInput } from '../types';

const MutationExample: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  // Obtain the mutation function with suppressed error toasts.
  const createInstance = bigweaver.useCreateInstanceFn({
    options: {
      meta: { suppressErrorNotification: true },
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const input: CreateInstanceInput = {
      instanceName: formData.get('instanceName') as string,
      instanceType: formData.get('instanceType') as string,
      region: formData.get('region') as string,
    };

    // Call mutate with onSuccess / onError callbacks.
    createInstance.mutate(input, {
      onSuccess: (data) => {
        setStatus(`Instance "${data.instanceName}" created (${data.instanceId})`);
      },
      onError: (error) => {
        setStatus(`Failed to create instance: ${error.message}`);
      },
    });
  };

  return (
    <div className="mutation-form">
      <h2>Create Instance</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="instanceName">
          Name
          <input id="instanceName" name="instanceName" defaultValue="my-instance" />
        </label>

        <label htmlFor="instanceType">
          Type
          <input id="instanceType" name="instanceType" defaultValue="t3.medium" />
        </label>

        <label htmlFor="region">
          Region
          <input id="region" name="region" defaultValue="us-east-1" />
        </label>

        <button type="submit" disabled={createInstance.isLoading}>
          {createInstance.isLoading ? 'Creating…' : 'Create'}
        </button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default MutationExample;
