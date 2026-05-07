import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTRPCClient, trpc } from '@/lib/trpc';
import { Stack } from 'expo-router';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Create tRPC client
const trpcClient = getTRPCClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

