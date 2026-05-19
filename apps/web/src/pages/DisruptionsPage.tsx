import { AlertTriangle } from 'lucide-react';
import { apiClient } from '../apiClient';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SourceBar } from '../components/SourceBar';
import { useApi } from '../components/useApi';

export function DisruptionsPage() {
  const state = useApi(apiClient.serviceAlerts, []);

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
          <p className="eyebrow">Betriebslage</p>
          <h1>Aktive Störungen</h1>
        </div>
        <SourceBar meta={state.data.meta} />
      </div>

      <div className="alert-list">
        {state.data.data.map((alert) => (
          <article className={`alert-row alert-row--${alert.severity}`} key={alert.alert_id}>
            <AlertTriangle aria-hidden="true" size={20} />
            <div>
              <h2>{alert.title}</h2>
              <p>{alert.description}</p>
              <small>
                {alert.cause} · {alert.effect}
              </small>
            </div>
            <strong>{alert.severity}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
