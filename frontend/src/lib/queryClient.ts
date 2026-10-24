import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  contents: ["contents"] as const,
  search: (q: string) => ["contents", "search", q] as const,
  shared: (hash: string) => ["shared", hash] as const,
};
