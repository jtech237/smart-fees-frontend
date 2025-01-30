"use client"

import { Classe, ClasseListResponse } from "@/types/classes"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createItem, fetchData, updateItem } from "@/lib/api-crud"
import { toast } from "sonner"
import { Classroom } from "@/types/classrooms"

const classroomSchema = z.object({
  name: z.string().min(3, "Le nom est trop court."),
  classe: z.number().int(),
})

type ClassroomDataType = z.infer<typeof classroomSchema>
type Props = {
  initialData?: ClassroomDataType & {id: number}
  onSuccess: () => void
}

export default function ClassroomForm({
  initialData, onSuccess
}: Props){
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<Pick<Classe, "id" | "name">[]>([])

  const form = useForm({
    resolver: zodResolver(classroomSchema),
    defaultValues: initialData ? initialData : {
      name: "",
    }
  })

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetchData<ClasseListResponse>("/classes", { limit: 100 });
        setClasses(res.data.map(c => ({ id: c.id, name: c.name })));
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
        toast.error("Impossible de charger les classes");
      }
    }
    loadClasses();
  }, []);

  const onSubmit: SubmitHandler<ClassroomDataType> = async (data) => {
    setLoading(true)
    try {
      if(initialData){
        const patchData: Record<string, string | number> = {}
        if(initialData.name !== data.name){
          patchData.name = data.name
        }
        if(initialData.classe !== data.classe){
          patchData.classe = data.classe
        }
        if(Object.keys(patchData).length === 0){
          toast.info("Aucune modification détectée");
          setLoading(false);
          return;
        }
        await updateItem<Classroom>("/classes", initialData.id, patchData)
        toast.success("Salle mise a jour")
      }else{
        await createItem<Classroom, ClassroomDataType>("/classrooms", data)
        toast.success("Salle cree !")
      }
      onSuccess()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement.", error)
      toast.error("Erreur lors de l'enregistrement.")
    }finally{
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Nom de la salle</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  autoComplete="off"
                  placeholder="Classroom"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classe"
          render={({field}) => (
            <FormItem>
              <FormLabel>Classe</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={
                  field.value !== null && field.value !== undefined
                    ? String(field.value)
                    : ""
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner une classe"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((classe) => (
                    <SelectItem value={`${classe.id}`} key={classe.id}>
                      {classe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button
            type="submit"
            disabled={
              !form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting
            }
          >
            {loading ? "Enregistrement..." : initialData ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
