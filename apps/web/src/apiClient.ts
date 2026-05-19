import type {
  ApiResponse,
  Departure,
  RawFeedDebug,
  ServiceAlert,
  VehiclePosition,
} from '@bim/shared';

const requestJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  departures: (stopId: string, limit = 8) =>
    requestJson<ApiResponse<Departure[]>>(`/api/departures?stop_id=${stopId}&limit=${limit}`),
  serviceAlerts: () => requestJson<ApiResponse<ServiceAlert[]>>('/api/service-alerts?active=true'),
  vehiclePositions: () => requestJson<ApiResponse<VehiclePosition[]>>('/api/vehicle-positions'),
  raw: (tripId: string) =>
    requestJson<ApiResponse<RawFeedDebug>>(`/api/raw/trip-updates?trip_id=${tripId}`),
};
