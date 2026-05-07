import { initTRPC, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { authRouter } from './routers/auth';

/**
 * Create context from Fastify request
 * Extracts Authorization header for auth token
 */
export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;

  return {
    token,
    req,
    res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create();

/**
 * Root app router
 * Combines all feature routers (auth, venues, etc.)
 */
export const appRouter = t.router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
