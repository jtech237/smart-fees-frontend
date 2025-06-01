import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchData, fetchOne } from "./api-crud";
import { CycleItemResponse, CycleListResponse } from "@/types/cycles";

const CYCLES_QUERY_KEY = ["cycles"];

export function useCycles(
  options: Partial<UseQueryOptions<CycleListResponse>> = {}
) {
  return useQuery({
    queryKey: CYCLES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchData<CycleListResponse>("/cycles");
      return response;
    },
    ...options,
  });
}

export function useCycle(
  id: string,
  options: Partial<UseQueryOptions<CycleItemResponse>> = {}
) {
  return useQuery({
    queryKey: [CYCLES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await fetchOne<CycleItemResponse>(
        "/cycles",
        id
      );
      return response;
    },
    ...options,
  });
}
