import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createItem, fetchData, updateItem } from "./api-crud"
import { Classroom, ClassroomListResponse } from "@/types/classrooms"

const CLASSROOMS_QUERY_KEY = ["classrooms"]

export function useClassrooms(){
  return useQuery({
    queryKey: CLASSROOMS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchData<ClassroomListResponse>("/classrooms")
      return res.data
    }
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
