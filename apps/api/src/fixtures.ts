import type { Departure, FeedMeta, RawFeedDebug, ServiceAlert, VehiclePosition } from '@bim/shared';
import { isStale } from '@bim/shared';

const addSeconds = (base: Date, seconds: number) => new Date(base.getTime() + seconds * 1000);

export function buildFeedMeta(source: FeedMeta['source'], dataTimestamp: Date, now = new Date()): FeedMeta {
  return {
    source,
    data_timestamp: dataTimestamp.toISOString(),
    fetched_at: now.toISOString(),
    is_stale: isStale(dataTimestamp.toISOString(), now.toISOString()),
    provider: 'ÖBB Mock',
  };
}

export function buildDepartures(now = new Date()): Departure[] {
  const freshTimestamp = addSeconds(now, -18).toISOString();
  const staleTimestamp = addSeconds(now, -120).toISOString();

  return [
    {
      route_id: 'rj-533',
      route_short_name: 'RJ 533',
      route_long_name: 'Railjet Richtung Villach Hbf',
      trip_id: 'demo-trip',
      stop_id: 'demo-stop',
      stop_name: 'Wien Meidling',
      destination: 'Villach Hbf',
      platform: '5',
      scheduled_departure_ts: addSeconds(now, 360).toISOString(),
      realtime_departure_ts: addSeconds(now, 540).toISOString(),
      delay_seconds: 180,
      status: 'delayed',
      source: 'realtime',
      data_timestamp: freshTimestamp,
    },
    {
      route_id: 's80',
      route_short_name: 'S80',
      route_long_name: 'S-Bahn Richtung Wien Aspern Nord',
      trip_id: 's80-demo-1',
      stop_id: 'demo-stop',
      stop_name: 'Wien Meidling',
      destination: 'Wien Aspern Nord',
      platform: '2',
      scheduled_departure_ts: addSeconds(now, 720).toISOString(),
      realtime_departure_ts: addSeconds(now, 720).toISOString(),
      delay_seconds: 0,
      status: 'on_time',
      source: 'realtime',
      data_timestamp: freshTimestamp,
    },
    {
      route_id: 'u6',
      route_short_name: 'U6',
      route_long_name: 'U-Bahn Richtung Floridsdorf',
      trip_id: 'u6-static-1',
      stop_id: 'demo-stop',
      stop_name: 'Wien Meidling',
      destination: 'Floridsdorf',
      platform: 'U6',
      scheduled_departure_ts: addSeconds(now, 960).toISOString(),
      status: 'static_fallback',
      source: 'static',
      data_timestamp: staleTimestamp,
    },
    {
      route_id: 'rj-740',
      route_short_name: 'RJ 740',
      route_long_name: 'Railjet Richtung Salzburg Hbf',
      trip_id: 'cancelled-demo',
      stop_id: 'west-demo',
      stop_name: 'Wien Westbahnhof',
      destination: 'Salzburg Hbf',
      platform: '7',
      scheduled_departure_ts: addSeconds(now, 1200).toISOString(),
      status: 'cancelled',
      source: 'realtime',
      data_timestamp: freshTimestamp,
    },
  ];
}

export function buildServiceAlerts(now = new Date()): ServiceAlert[] {
  const dataTimestamp = addSeconds(now, -20).toISOString();

  return [
    {
      alert_id: 'alert-1',
      title: 'Verspätungen zwischen Wien Meidling und Wien Hauptbahnhof',
      description: 'Wegen einer betrieblichen Störung kommt es derzeit zu Verzögerungen bis 10 Minuten.',
      severity: 'major',
      cause: 'technical_problem',
      effect: 'significant_delays',
      informed_entities: [{ route_id: 'rj-533' }, { stop_id: 'demo-stop' }],
      start_ts: addSeconds(now, -900).toISOString(),
      end_ts: addSeconds(now, 3600).toISOString(),
      data_timestamp: dataTimestamp,
    },
    {
      alert_id: 'alert-2',
      title: 'Aufzug außer Betrieb in Wien Meidling',
      description: 'Ein Aufzug ist aktuell nicht verfügbar. Bitte nutzen Sie alternative Zugänge.',
      severity: 'minor',
      cause: 'maintenance',
      effect: 'accessibility_issue',
      informed_entities: [{ stop_id: 'demo-stop' }],
      start_ts: addSeconds(now, -3600).toISOString(),
      data_timestamp: dataTimestamp,
    },
  ];
}

export function buildVehiclePositions(now = new Date()): VehiclePosition[] {
  const dataTimestamp = addSeconds(now, -16).toISOString();

  return [
    {
      vehicle_id: 'veh-rj-533',
      trip_id: 'demo-trip',
      route_id: 'rj-533',
      route_short_name: 'RJ 533',
      lat: 48.1745,
      lon: 16.3339,
      bearing: 155,
      speed: 19,
      occupancy_status: 'few_seats_available',
      data_timestamp: dataTimestamp,
    },
    {
      vehicle_id: 'veh-s80-1',
      trip_id: 's80-demo-1',
      route_id: 's80',
      route_short_name: 'S80',
      lat: 48.1849,
      lon: 16.3774,
      bearing: 80,
      speed: 14,
      occupancy_status: 'many_seats_available',
      data_timestamp: dataTimestamp,
    },
  ];
}

export function buildRawFeed(feedType: string, requestedId?: string, now = new Date()): RawFeedDebug {
  return {
    feed_type: feedType,
    requested_id: requestedId,
    normalized_preview: {
      departures: buildDepartures(now).filter((departure) => !requestedId || departure.trip_id === requestedId),
      alerts: buildServiceAlerts(now),
    },
    raw_preview: {
      entity: [
        {
          id: requestedId ?? 'demo-trip',
          trip_update: {
            trip: { trip_id: requestedId ?? 'demo-trip', route_id: 'rj-533' },
            stop_time_update: [{ stop_id: 'demo-stop', departure: { delay: 180 } }],
          },
        },
      ],
      header: {
        gtfs_realtime_version: '2.0',
        timestamp: Math.floor(now.getTime() / 1000),
      },
    },
    note: 'Mock-Feed zur Transparenz. Keine produktive ÖBB-Verbindung aktiv.',
  };
}
