import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'api/src/router';
import { useAuthStore } from '../stores/authStore';

/**
 * Create tRPC React client
 * Automatically includes Authorization header from auth store
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get tRPC client configuration
 * Injects auth token from store into every request
 */
export const getTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/trpc`,
        headers() {
          const token = useAuthStore.getState().getAuthToken();
          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
      }),
    ],
  });
};

/**
 * Hook to use tRPC procedures in components
 * Example:
 * const { mutate: sendOtp } = trpc.auth.sendOtp.useMutation();
 * const { data: session } = trpc.auth.verifyOtp.useMutation();
 */
export const useTRPC = () => trpc;
