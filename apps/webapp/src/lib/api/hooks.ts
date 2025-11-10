/**
 * React Query hooks для API вызовов
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

/**
 * Hook для health check
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.health(),
    refetchInterval: 30000, // Каждые 30 секунд
  });
}

/**
 * Generic GET hook
 */
export function useApiGet<T>(endpoint: string, enabled = true) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => apiClient.get<T>(endpoint),
    enabled,
  });
}

/**
 * Generic POST hook
 */
export function useApiPost<TData, TVariables>(endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => apiClient.post<TData>(endpoint, variables),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}
