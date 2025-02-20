import { useQuery } from "@tanstack/react-query";
import { getCurrentAcademicYear } from "../utils";
import { fetchData } from "./api-crud";
import { FeesResponse } from "@/types/fees";

export interface FeesQueryParams {
  search?: string;
  academic_year?: string;
  fee_type?: string;
  classe?: number;
  limit?: number;
  offset?: number;
}
export function useFees(
  params: FeesQueryParams = {
    academic_year: getCurrentAcademicYear(),
    limit: 100,
    offset: 0,
  }
) {
  const {
    academic_year = getCurrentAcademicYear(),
    fee_type,
    classe,
    search,
    limit,
    offset,
  } = params;
  return useQuery<FeesResponse, Error>({
    queryKey: ["fees", academic_year, fee_type, classe, search, limit, offset],
    queryFn: async () => {
      return await fetchData<FeesResponse>("/fees", {
        academic_year,
        fee_type,
        classe,
        search,
        limit,
        offset,
      });
    },
    staleTime: 60000,
  });
}
