import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '4000', 10);
const host = process.env.HOST ?? '127.0.0.1';
const app = createApp();

try {
  await app.listen({ port, host });
  console.log(`bim API listening on http://${host}:${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
