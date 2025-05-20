import { Classe, ClasseListResponse, RequiredDocument } from '@/types/classes';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { createItem, deleteItem, fetchData, fetchOne, updateItem } from './api-crud';
import { stableSerialize } from '../utils';
import { cleanQueryParams } from './hook';

const CLASSES_QUERY_KEY = ["classes"]

export type ClassesQueryParams = {
  search?: string;
  parent_id?: string;
  parent_name?: string
  limit?: number;
  offset?: number;
  cycle_id?: number;
  orphan?: boolean
}

export function useClasses(params: ClassesQueryParams = {}, options?: UseQueryOptions<Classe[], Error>){
  const cleanParams = cleanQueryParams(params)
  const queryKey = [CLASSES_QUERY_KEY, stableSerialize(cleanParams)]
  return useQuery<Classe[], Error>({
    queryKey,
    queryFn: async () => {
      const response = await fetchData<ClasseListResponse>("/classes", cleanParams)
      return response.items
    },
    ...options
  })
}

export function useRequiredDocuments(params: {classeId: number}, options?: UseQueryOptions<RequiredDocument[]>){
  return useQuery<RequiredDocument[]>({
    queryKey: ["required-docs", params.classeId],
    queryFn: async () => {
      return await fetchData<RequiredDocument[]>(`/classes/${params.classeId}/required-docs`)
    },
    enabled: !!params.classeId,
    ...options
  })
}

export function useCreateClasse(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newClasse: {name: string, parent?: number | null}) => {
      const response = await createItem<Classe>("/classes", newClasse)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY, refetchType: "active" })
    }
  })
}

export function useUpdateClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: {
      name?: string,
      parent?: number | null
    } }) => {
      const response = await updateItem<Classe>(`/classes`, id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY, refetchType: "active" });
    },
  });
}

export function useDeleteClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteItem(`/classes`, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY, refetchType: "active"  });
    },
  });
}

export function useClasse(classeId: number){
  return useQuery({
    queryFn: async () => {
      return await fetchOne<Classe>("/classes", String(classeId))
    },
    queryKey: [CLASSES_QUERY_KEY, classeId]
  })
}
