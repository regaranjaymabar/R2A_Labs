import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface GetOptions<TData = any, TError = AxiosError<{ message?: string }>>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  offlineFallbackData?: TData;
}

export function useGet<TData = any, TError = AxiosError<{ message?: string }>>({
  queryKey,
  queryFn,
  offlineFallbackData,
  staleTime = 5 * 60 * 1000, // Cache aktif selama 5 menit
  gcTime = 30 * 60 * 1000, // Disimpan di memori cache selama 30 menit
  ...queryOptions
}: GetOptions<TData, TError>) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (err: any) {
        if (!err.response && offlineFallbackData !== undefined) {
          console.warn(`Server offline, menggunakan data fallback lokal untuk queryKey: [${queryKey.join(", ")}]`);
          return offlineFallbackData;
        }
        throw err;
      }
    },
    staleTime,
    gcTime,
    ...queryOptions,
  });
}
