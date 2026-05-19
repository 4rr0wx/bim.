import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('bim api', () => {
  it('returns health status', async () => {
    const response = await app.inject('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ok', compliance_mode: 'mock-only' });
  });

  it('requires stop_id for departures', async () => {
    const response = await app.inject('/api/departures');

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ error: 'missing_stop_id' });
  });

  it('returns limited departures for a stop', async () => {
    const response = await app.inject('/api/departures?stop_id=demo-stop&limit=2');
    const payload = response.json();

    expect(response.statusCode).toBe(200);
    expect(payload.meta).toMatchObject({ source: 'realtime', provider: 'ÖBB Mock' });
    expect(payload.data).toHaveLength(2);
    expect(payload.data[0]).toMatchObject({ stop_id: 'demo-stop', route_short_name: 'RJ 533' });
  });

  it('returns raw debug feed data', async () => {
    const response = await app.inject('/api/raw/trip-updates?trip_id=demo-trip');
    const payload = response.json();

    expect(response.statusCode).toBe(200);
    expect(payload.data).toMatchObject({
      feed_type: 'trip-updates',
      requested_id: 'demo-trip',
    });
  });
});
