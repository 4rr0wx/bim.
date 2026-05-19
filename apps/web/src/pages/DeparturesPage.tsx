import { delayLabel } from '@bim/shared';
import { Clock, TrainFront } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../apiClient';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SourceBar } from '../components/SourceBar';
import { useApi } from '../components/useApi';

const time = (iso: string) =>
  new Intl.DateTimeFormat('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export function DeparturesPage() {
  const { stationId = 'demo-stop' } = useParams();
  const state = useApi(() => apiClient.departures(stationId), [stationId]);

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
          <p className="eyebrow">Abfahrten</p>
          <h1>{state.data.data[0]?.stop_name ?? stationId}</h1>
        </div>
        <SourceBar meta={state.data.meta} />
      </div>

      <div className="departure-list">
        {state.data.data.map((departure) => (
          <article className="departure-card" key={departure.trip_id}>
            <div className="route-badge">
              <TrainFront aria-hidden="true" size={18} />
              <strong>{departure.route_short_name}</strong>
            </div>
            <div>
              <h2>{departure.destination}</h2>
              <p>{departure.route_long_name}</p>
            </div>
            <div className="time-block">
              <Clock aria-hidden="true" size={18} />
              <span>{time(departure.realtime_departure_ts ?? departure.scheduled_departure_ts)}</span>
              <small>Soll {time(departure.scheduled_departure_ts)}</small>
            </div>
            <div className={`status-pill status-pill--${departure.status}`}>
              {departure.status === 'static_fallback' ? 'Fahrplan' : delayLabel(departure.delay_seconds)}
            </div>
            <p className="platform">Gleis {departure.platform ?? '-'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
