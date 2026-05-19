import { Code2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../apiClient';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SourceBar } from '../components/SourceBar';
import { useApi } from '../components/useApi';

export function RawPage() {
  const { tripId = 'demo-trip' } = useParams();
  const state = useApi(() => apiClient.raw(tripId), [tripId]);

  if (state.status === 'loading') {
    return <LoadingState />;
  }

  if (state.status === 'error') {
    return <ErrorState />;
  }

  return (
    <section className="view">
      <div className="view-header">
        <div>
          <p className="eyebrow">Debug</p>
          <h1>Rohdaten</h1>
        </div>
        <SourceBar meta={state.data.meta} />
      </div>
      <div className="raw-shell">
        <div className="raw-heading">
          <Code2 aria-hidden="true" size={20} />
          <strong>{state.data.data.feed_type}</strong>
        </div>
        <pre>{JSON.stringify(state.data.data, null, 2)}</pre>
      </div>
    </section>
  );
}
