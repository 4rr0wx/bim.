import type { ApiResponse, Departure, RawFeedDebug, ServiceAlert, VehiclePosition } from '@bim/shared';
import { buildDepartures, buildFeedMeta, buildRawFeed, buildServiceAlerts, buildVehiclePositions } from './fixtures.js';

const newestTimestamp = (items: Array<{ data_timestamp: string }>) =>
  items.reduce((newest, item) => (item.data_timestamp > newest ? item.data_timestamp : newest), items[0]?.data_timestamp);

export class MockTransitRepository {
  getDepartures(stopId: string, limit = 8): ApiResponse<Departure[]> {
    const data = buildDepartures()
      .filter((departure) => departure.stop_id === stopId)
      .slice(0, limit);
    const source = data.some((departure) => departure.source === 'realtime') ? 'realtime' : 'static';
    const timestamp = newestTimestamp(data) ?? new Date().toISOString();

    return {
      meta: buildFeedMeta(source, new Date(timestamp)),
      data,
    };
  }

  getServiceAlerts(activeOnly = true): ApiResponse<ServiceAlert[]> {
    const now = new Date();
    const data = buildServiceAlerts(now).filter((alert) => {
      if (!activeOnly) {
        return true;
      }

      return Date.parse(alert.start_ts) <= now.getTime() && (!alert.end_ts || Date.parse(alert.end_ts) >= now.getTime());
    });

    return {
      meta: buildFeedMeta('realtime', new Date(newestTimestamp(data) ?? now.toISOString())),
      data,
    };
  }

  getVehiclePositions(routeId?: string): ApiResponse<VehiclePosition[]> {
    const data = buildVehiclePositions().filter((position) => !routeId || position.route_id === routeId);

    return {
      meta: buildFeedMeta('realtime', new Date(newestTimestamp(data) ?? new Date().toISOString())),
      data,
    };
  }

  getRaw(feedType: string, requestedId?: string): ApiResponse<RawFeedDebug> {
    const now = new Date();

    return {
      meta: buildFeedMeta('realtime', new Date(now.getTime() - 15_000), now),
      data: buildRawFeed(feedType, requestedId, now),
    };
  }
}
