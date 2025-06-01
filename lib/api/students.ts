import { createItem, fetchData, fetchOne, updateItem } from "./api-crud";
import snakecaseKeys from "snakecase-keys";
import { FormValues, step1Schema, step2Schema, step3Schema } from "@/components/students/schemas";
import {
  useMutation,
  UseMutationOptions,
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
import { ToSnakeCaseObject } from "@/types";
import { z } from "zod";

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

async function payFee({
  feeId,
  method,
}: {
  feeId: number;
  method: number;
}) {
  return await api.post<{datail: string}>("/payments", {
    fee_id: feeId,
    method_id: method,
  });
}

export function useCreatePayment(){
  return useMutation({
    mutationFn: payFee,
  })
}


async function uploadDoc(data: {
  file: File,
  doc_type_id: number
}){
  if(!window){
    throw new Error("Not server")
  }
  const formData = new FormData()
  formData.append("file", data.file)

  return await api.postForm<{status: boolean}>(`/documents/upload?document_type_id=${data.doc_type_id}`, data)
}

export function useUploadDoc(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadDoc,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["student"]})
  })
}

export const formSchema = step1Schema.merge(step2Schema).merge(step3Schema)
export type StudentFormValues = z.infer<typeof formSchema>
export type StudentCreatePayload = ToSnakeCaseObject<StudentFormValues>
export type StudentUpdatePayload = Partial<StudentCreatePayload>

export async function createStudentFc(data: StudentCreatePayload){
  const body = {
    ...data,
    birthday: format(new Date(data.birthday), "yyyy-MM-dd"),
  };

  return await createItem<StudentBaseResponse>("/students", body)
}

export function useCreateStudent(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudentFc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["students", "pre-registrations"],
      });
    },
  })
}

async function updateStudentFn({
  id,
  data,
}: {
  id: number;
  data: StudentUpdatePayload;
}) {
  const cleanedData = cleanQueryParams(data || {});
  return await updateItem<StudentBaseResponse>("/students", id, cleanedData);
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentFn,
    onSuccess: (_res, variables) => {
      // Invalide la donnée du student mis à jour ainsi que la liste
      queryClient.invalidateQueries({
        queryKey: ["student", variables.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
