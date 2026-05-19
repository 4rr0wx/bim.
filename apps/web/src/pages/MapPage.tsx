import { MapPinned } from 'lucide-react';
import { apiClient } from '../apiClient';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SourceBar } from '../components/SourceBar';
import { useApi } from '../components/useApi';

export function MapPage() {
  const state = useApi(apiClient.vehiclePositions, []);

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
          <p className="eyebrow">Netz</p>
          <h1>Kartenansicht</h1>
        </div>
        <SourceBar meta={state.data.meta} />
      </div>

      <div className="map-surface" aria-label="Mock-Kartenansicht mit Fahrzeugpositionen">
        {state.data.data.map((vehicle, index) => (
          <div className="vehicle-marker" key={vehicle.vehicle_id} style={{ left: `${24 + index * 34}%`, top: `${34 + index * 22}%` }}>
            <MapPinned aria-hidden="true" size={18} />
            <span>{vehicle.route_short_name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
