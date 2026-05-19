import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

const meta = {
  source: 'realtime',
  data_timestamp: new Date().toISOString(),
  fetched_at: new Date().toISOString(),
  is_stale: false,
  provider: 'ÖBB Mock',
};

describe('App routing', () => {
  it('renders departures with attribution', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          meta,
          data: [
            {
              route_id: 'rj-533',
              route_short_name: 'RJ 533',
              route_long_name: 'Railjet Richtung Villach Hbf',
              trip_id: 'demo-trip',
              stop_id: 'demo-stop',
              stop_name: 'Wien Meidling',
              destination: 'Villach Hbf',
              platform: '5',
              scheduled_departure_ts: new Date().toISOString(),
              realtime_departure_ts: new Date().toISOString(),
              delay_seconds: 180,
              status: 'delayed',
              source: 'realtime',
              data_timestamp: new Date().toISOString(),
            },
          ],
        }),
      ),
    );

    render(
      <MemoryRouter initialEntries={['/departures/demo-stop']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Wien Meidling')).toBeInTheDocument());
    expect(screen.getAllByText('Datenquelle: ÖBB Mock').length).toBeGreaterThan(0);
    expect(screen.getByText('+3 min')).toBeInTheDocument();
  });

  it('renders disruptions route', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          meta,
          data: [
            {
              alert_id: 'alert-1',
              title: 'Verspätungen zwischen Wien Meidling und Wien Hauptbahnhof',
              description: 'Wegen einer betrieblichen Störung kommt es derzeit zu Verzögerungen.',
              severity: 'major',
              cause: 'technical_problem',
              effect: 'significant_delays',
              informed_entities: [],
              start_ts: new Date().toISOString(),
              data_timestamp: new Date().toISOString(),
            },
          ],
        }),
      ),
    );

    render(
      <MemoryRouter initialEntries={['/disruptions']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Aktive Störungen')).toBeInTheDocument());
    expect(screen.getByText(/Verspätungen/)).toBeInTheDocument();
  });
});
