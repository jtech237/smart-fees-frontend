import { Classe, ClasseListResponse, RequiredDocument } from '@/types/classes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createItem, deleteItem, fetchData, fetchOne, updateItem } from './api-crud';

const CLASSES_QUERY_KEY = ["classes"]

export interface ClassesQueryParams{
  search?: string;
  parent_id?: string;
  parent_name?: string
  limit?: number;
  offset?: number;
  cycle_id?: number;
  orphan?: boolean
}

function cleanClassesQueryParams(params: ClassesQueryParams = {}): Record<string, string|number|boolean>{
  const defaultParams: Partial<ClassesQueryParams> = {
    offset: params.offset != null ? params.offset : 0,
    limit: params.limit != null ? params.limit : 100,
  }

  const otherParams: Partial<ClassesQueryParams> = Object.fromEntries(
      Object.entries(params)
      .filter(([_, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => [k, typeof v === "number" ? String(v) : v])
    )

    return {...defaultParams, ...otherParams}
}

export function useClasses(params: ClassesQueryParams = {}){
  const cleanParams = cleanClassesQueryParams(params)
  return useQuery<Classe[], Error>({
    queryKey: [CLASSES_QUERY_KEY, cleanParams],
    queryFn: async () => {
      const response = await fetchData<ClasseListResponse>("/classes", cleanParams)
      return response.items
    }
  })
}

export function useRequiredDocuments(params: {classeId: number}){
  return useQuery<RequiredDocument[]>({
    queryKey: ["required-docs", params],
    queryFn: async () => {
      return await fetchData<RequiredDocument[]>(`/classes/${params.classeId}/required-docs`)
    }
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
