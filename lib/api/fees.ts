import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getCurrentAcademicYear } from "../utils";
import { createItem, deleteItem, fetchData, patchItem } from "./api-crud";
import {
  Fee,
  FeeCreatePayload,
  FeesResponse,
  FeeType,
  FeeUpdatePayload,
} from "@/types/fees";

const FEES_QUERY_KEY = ["fees"];
const FEE_TYPES_QUERY_KEY = ["fees-types"];

function cleanFeesQueryParams(params: FeesQueryParams = {}): Record<string, string|number>{
  const defaultParams: Partial<FeesQueryParams> = {
    academic_year: params.academic_year || getCurrentAcademicYear(),
    offset: params.offset != null ? params.offset : 0,
    limit: params.limit != null ? params.limit : 100,
  }

  const otherParams: Partial<FeesQueryParams> = Object.fromEntries(
    Object.entries(params)
    .filter(([_, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => [k, typeof v === "number" ? String(v) : v])
  )

  return {...defaultParams, ...otherParams}
}

export function useFeeTypes() {
  return useQuery<FeeType[], Error>({
    queryKey: FEE_TYPES_QUERY_KEY,
    queryFn: () => fetchData<FeeType[]>("/fees/types"),
    staleTime: 60 * 60 * 1000,
  });
}

export interface FeeTypePayload{
  name: string;
  description?: string;
  is_due_date_fixed?: boolean;
  default_due_date?: string;
}

export function useCreateFeeType() {
  const queryClient = useQueryClient()
  return useMutation<FeeType, Error, FeeTypePayload>({
    mutationFn: (data) => createItem<FeeType>("/fees/types", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEE_TYPES_QUERY_KEY })
    }
  })
}

export interface FeesQueryParams {
  search?: string;
  academic_year?: string;
  fee_type?: string | number;
  classe?: number;
  limit?: number;
  offset?: number;
}
export function useFees(params: FeesQueryParams = {}) {
  const cleanParams = cleanFeesQueryParams(params);

  return useQuery<FeesResponse, Error>({
    queryKey: [FEES_QUERY_KEY, cleanParams],
    queryFn: () => fetchData<FeesResponse>("/fees", cleanParams),
    staleTime: 60 * 1000,
    // keepPreviousData: true,
  });
}

export function useCheckExistingFee(params: FeesQueryParams){
  return useQuery<FeesResponse, Error>({
    queryKey: [FEES_QUERY_KEY, cleanFeesQueryParams(params)],
    queryFn: () => fetchData<FeesResponse>("/fees", {
      ...cleanFeesQueryParams(params),
      limit: 1,
    }),
    enabled: !!params.classe && !!params.fee_type,
  })
}

export function useCreateFee() {
  const queryClient = useQueryClient();

  return useMutation<Fee, Error, FeeCreatePayload>({
    mutationFn: (newFee) => createItem<Fee>("/fees", newFee),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEES_QUERY_KEY,
      });
      // TODO: Add optimistic update
    },
  });
}

export function useUpdateFee() {
  const queryClient = useQueryClient();

  return useMutation<Fee, Error, FeeUpdatePayload>({
    mutationFn: ({ id, ...data }) => patchItem<Fee>("/fees", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEES_QUERY_KEY,
      });
      // TODO: Add optimistic update
    },
  });
}

export function useDeleteFee() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteItem("/fees", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEES_QUERY_KEY });
    },
  });
}

export type RequiredFees = Omit<Fee, "dueDate"|"classe"|"feesType"|"academicYear" | "amount" > & {
  deadline: string | Date;
  amount: number;
  status: boolean
}
export function useRequiredFees(studentId: number, options: Partial<UseQueryOptions<RequiredFees[]>>){
  return useQuery({
    queryKey: [FEES_QUERY_KEY, studentId],
    queryFn: () =>fetchData<RequiredFees[]>(`/students/${studentId}/required-fees`),
    ...options
  })
}
