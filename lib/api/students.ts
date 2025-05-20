import { createItem } from "./api-crud";
import snakecaseKeys from "snakecase-keys"
import { FormValues } from "@/components/students/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

type PreRegristrationPayload = FormValues
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
}

export async function createPreRegistration(data: PreRegristrationPayload){
  const body = snakecaseKeys({
    ...data,
    birthday: format(data.birthday, "yyyy-MM-dd"),
  })
  const res = await createItem<PreRegristrationResponse>("/students/pre-registration", body)
  return res
}

export function usePreRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPreRegistration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pre-registrations'] }),
  });
}

