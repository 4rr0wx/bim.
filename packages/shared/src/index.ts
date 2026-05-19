export type FeedSource = 'realtime' | 'static';

export type FeedMeta = {
  source: FeedSource;
  data_timestamp: string;
  fetched_at: string;
  is_stale: boolean;
  provider: 'ÖBB Mock';
};

export type ApiResponse<T> = {
  meta: FeedMeta;
  data: T;
};

export type DepartureStatus = 'on_time' | 'delayed' | 'cancelled' | 'static_fallback';

export type Departure = {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  trip_id: string;
  stop_id: string;
  stop_name: string;
  destination: string;
  platform?: string;
  scheduled_departure_ts: string;
  realtime_departure_ts?: string;
  delay_seconds?: number;
  status: DepartureStatus;
  source: FeedSource;
  data_timestamp: string;
};

export type AlertSeverity = 'info' | 'minor' | 'major' | 'critical';

export type ServiceAlert = {
  alert_id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  cause: string;
  effect: string;
  informed_entities: Array<{
    route_id?: string;
    stop_id?: string;
    trip_id?: string;
  }>;
  start_ts: string;
  end_ts?: string;
  data_timestamp: string;
};

export type VehiclePosition = {
  vehicle_id: string;
  trip_id: string;
  route_id: string;
  route_short_name: string;
  lat: number;
  lon: number;
  bearing?: number;
  speed?: number;
  occupancy_status?: 'empty' | 'many_seats_available' | 'few_seats_available' | 'standing_room_only';
  data_timestamp: string;
};

export type RawFeedDebug = {
  feed_type: string;
  requested_id?: string;
  normalized_preview: unknown;
  raw_preview: unknown;
  note: string;
};

export function secondsBetween(earlierIso: string, laterIso = new Date().toISOString()): number {
  return Math.max(0, Math.round((Date.parse(laterIso) - Date.parse(earlierIso)) / 1000));
}

export function formatRelativeAge(isoTimestamp: string, nowIso = new Date().toISOString()): string {
  const seconds = secondsBetween(isoTimestamp, nowIso);

  if (seconds < 5) {
    return 'gerade eben';
  }

  if (seconds < 60) {
    return `vor ${seconds}s`;
  }

  const minutes = Math.round(seconds / 60);
  return `vor ${minutes}min`;
}

export function isStale(
  dataTimestamp: string,
  nowIso = new Date().toISOString(),
  staleAfterSeconds = 45,
): boolean {
  return secondsBetween(dataTimestamp, nowIso) > staleAfterSeconds;
}

export function delayLabel(delaySeconds?: number): string {
  if (!delaySeconds) {
    return 'pünktlich';
  }

  const minutes = Math.round(delaySeconds / 60);
  return minutes > 0 ? `+${minutes} min` : `${minutes} min`;
}
