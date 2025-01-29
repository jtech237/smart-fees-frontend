"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createItem, fetchData, updateItem } from "@/lib/api-crud";
import { Classe, ClasseListResponse } from "@/types/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const classeSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  parent: z.union([z.number(), z.null()]).optional(),
});

type Props = {
  initialData?: { id: number; name: string; parent?: number | null };
  onSuccess: () => void;
};

export default function ClasseForm({ initialData, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState<Classe[]>([]);

  const form = useForm<z.infer<typeof classeSchema>>({
    resolver: zodResolver(classeSchema),
    defaultValues: initialData ? initialData : { name: "", parent: null },
  });
  const { formState } = form;

  useEffect(() => {
    async function loadParents() {
      const res = await fetchData<ClasseListResponse>("/classes", {
        limit: 100,
      });
      if (initialData) {
        const newParents = res.data.filter(
          (p) => p.id !== initialData.id && p.depth <= 3
        );
        setParents(newParents);
      } else {
        setParents(res.data);
      }
    }
    loadParents();
  }, [initialData]);

  const onSubmit: SubmitHandler<z.infer<typeof classeSchema>> = async (data) => {
    setLoading(true)
    try {
      if(initialData){
        await updateItem<Classe>("/classes", initialData.id, data)
        toast.success("Classe mise a jour!")
      }else{
        await createItem<Classe>("/classes", data)
        toast.success("Classe créée !");
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Erreur l'or de l'enregistrement.")
    }finally{
      setLoading(false)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {formState.errors.root?.message && (
          <p role="alert" className="text-destructive-foreground">
            {formState.errors.root.message}
          </p>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Nom de la classe</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  aria-invalid={!formState.isValid}
                  {...field}
                  placeholder="Classe name"
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Classe parente</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "null" ? null : Number(value))
                  }
                  value={
                    field.value !== null && field.value !== undefined
                      ? String(field.value)
                      : ""
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Aucune</SelectItem>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={`${parent.id}`}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )
          }}
        />
        <div className="mt-4">
          <Button
            type="submit"
            disabled={
              !formState.isDirty || !formState.isValid || formState.isSubmitting
            }
          >
            {loading ? "Enregistrement..." : initialData ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
