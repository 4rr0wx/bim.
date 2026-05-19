import cors from '@fastify/cors';
import Fastify from 'fastify';
import { MockTransitRepository } from './mockRepository.js';

export function createApp() {
  const app = Fastify({ logger: false });
  const repository = new MockTransitRepository();

  app.register(cors, {
    origin: true,
  });

  app.get('/api/health', async () => ({
    status: 'ok',
    service: 'bim-api',
    compliance_mode: 'mock-only',
  }));

  app.get('/api/departures', async (request, reply) => {
    const query = request.query as { stop_id?: string; limit?: string };

    if (!query.stop_id) {
      return reply.code(400).send({
        error: 'missing_stop_id',
        message: 'Parameter stop_id ist erforderlich.',
      });
    }

    const parsedLimit = query.limit ? Number.parseInt(query.limit, 10) : 8;
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 8;

    return repository.getDepartures(query.stop_id, limit);
  });

  app.get('/api/service-alerts', async (request) => {
    const query = request.query as { active?: string };
    return repository.getServiceAlerts(query.active !== 'false');
  });

  app.get('/api/vehicle-positions', async (request) => {
    const query = request.query as { route_id?: string };
    return repository.getVehiclePositions(query.route_id);
  });

  app.get('/api/raw/:feedType', async (request) => {
    const params = request.params as { feedType: string };
    const query = request.query as { trip_id?: string };
    return repository.getRaw(params.feedType, query.trip_id);
  });

  return app;
}
