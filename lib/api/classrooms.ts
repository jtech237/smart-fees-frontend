import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { createItem, fetchData, updateItem } from "./api-crud"
import { Classroom, ClassroomListResponse } from "@/types/classrooms"
import { cleanQueryParams } from "./hook"
import { stableSerialize } from "../utils"

const CLASSROOMS_QUERY_KEY = ["classrooms"]

export function useClassrooms(params: Record<string, unknown> = {}, options: Partial<UseQueryOptions<Classroom[]>> = {}){
  const cleanedParams = cleanQueryParams(params)
  return useQuery({
    queryKey: [CLASSROOMS_QUERY_KEY, stableSerialize(cleanedParams)],
    queryFn: async () => {
      const res = await fetchData<ClassroomListResponse>("/classrooms", cleanedParams)
      return res.items
    },
    ...options
  })
}

export function useCreateClassroom(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newClasse: {name: string, classe: number}) => {
      const res = await createItem<Classroom>("/classrooms", newClasse)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: CLASSROOMS_QUERY_KEY, refetchType: "active"})
    }
  })
}

export function useUpdateClassroom(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, data}: {id: number, data: {name?: string, classe?: number}}) => {
      const res = await updateItem<Classroom>("/classrooms", id, data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: CLASSROOMS_QUERY_KEY, refetchType: "active"})
    }
  })
}
