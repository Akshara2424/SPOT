import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from './router';

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// tRPC endpoint - use fetch adapter
fastify.all('/trpc/:path', async (request, reply) => {
  const response = await fetchRequestHandler({
    endpoint: '/trpc',
    req: request as any,
    router: appRouter,
    createContext: () => createContext({
      req: request as any,
      res: reply as any,
    }),
  });
  
  reply.raw.writeHead(response.status, response.headers);
  reply.raw.end(response.body);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
