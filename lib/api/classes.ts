import { Classe, ClasseListResponse } from '@/types/classes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createItem, deleteItem, fetchData, updateItem } from './api-crud';

const CLASSES_QUERY_KEY = ["classes"]

export function useClasses(){
  return useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchData<ClasseListResponse>("/classes")
      return response.items
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
