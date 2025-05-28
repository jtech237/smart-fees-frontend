import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchData } from "./api-crud";
import { CycleListResponse } from "@/types/cycles";

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
