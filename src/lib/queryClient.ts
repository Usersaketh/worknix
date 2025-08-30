import { QueryClient } from '@tanstack/react-query';

// Shared singleton QueryClient so components (e.g., for prefetch) can access it.
export const queryClient = new QueryClient();
