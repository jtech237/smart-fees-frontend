import { createItem, fetchData, fetchOne } from "./api-crud";
import snakecaseKeys from "snakecase-keys";
import { FormValues } from "@/components/students/schemas";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { format } from "date-fns";
import {
  RegistrationResponse,
  StudentBaseResponse,
  StudentProfile,
} from "@/types/user";
import { cleanQueryParams } from "./hook";
import { stableSerialize } from "../utils";
import api from ".";

type PreRegristrationPayload = FormValues;
type PreRegristrationResponse = {
  id: number;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  classe: {
    id: number;
    name: string;
  };
  matricule: string;
  password: string;
};

export async function createPreRegistration(data: PreRegristrationPayload) {
  const body = snakecaseKeys({
    ...data,
    birthday: format(data.birthday, "yyyy-MM-dd"),
  });
  const res = await createItem<PreRegristrationResponse>(
    "/students/pre-registration",
    body
  );
  return res;
}

export function usePreRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPreRegistration,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pre-registrations"] }),
  });
}

export function useStudents(
  params: Record<string, unknown> = {},
  options: Partial<UseQueryOptions<StudentBaseResponse>> = {}
) {
  const cleanedParams = cleanQueryParams(params);
  return useQuery({
    queryKey: ["students", stableSerialize(cleanedParams)],
    queryFn: () => fetchData<StudentBaseResponse>("/students", cleanedParams),
    ...options,
  });
}

export function usePreRegistrations(
  params: Record<string, unknown> = {},
  options: Partial<UseQueryOptions<RegistrationResponse>> = {}
) {
  const cleanedParams = cleanQueryParams(params);
  return useQuery({
    queryKey: [
      ["students"],
      "pre-registrations",
      stableSerialize(cleanedParams),
    ],
    queryFn: () =>
      fetchData<RegistrationResponse>(
        "/students/pre-registrations",
        cleanedParams
      ),
    ...options,
  });
}

export function useStudent(
  id: string,
  options: Partial<UseQueryOptions<StudentProfile>> = {}
) {
  return useQuery({
    queryKey: ["student"],
    queryFn: () => fetchOne<StudentProfile>("/students", id),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...options,
  });
}

export async function payFee({
  feeId,
  method,
}: {
  feeId: number;
  method: string;
}) {
  return api.post("/api/payments/", {
    fee_id: feeId,
    method_id: method,
  });
}
