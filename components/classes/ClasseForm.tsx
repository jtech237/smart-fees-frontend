"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  useClasses,
  useCreateClasse,
  useUpdateClasse,
} from "@/lib/api/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCycles } from "@/lib/api/cycles";

const classeSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  parent: z.union([z.number(), z.null()]).optional(),
  cycle: z.number().int().positive(),
});

type Props = {
  initialData?: { id: number; name: string; parent?: number | null, cycle: number };
  onSuccess?: () => void;
};

export default function ClasseForm({ initialData, onSuccess }: Props) {
  const form = useForm<z.infer<typeof classeSchema>>({
    resolver: zodResolver(classeSchema),
    defaultValues: initialData ? initialData : { name: "", parent: null, cycle: 0},
  });
  const { formState } = form;
  const createClasse = useCreateClasse();
  const updateClasse = useUpdateClasse();

  const { data: parentsData } = useClasses();
  const {data: cyclesData} = useCycles()
  const parents =
    parentsData?.filter(
      (p) => !initialData || (p.id !== initialData.id && p.depth <= 3)
    ) || [];

  const isPending = createClasse.isPending || updateClasse.isPending;

  const onSubmit: SubmitHandler<z.infer<typeof classeSchema>> = async (
    data
  ) => {
    if (initialData) {
      updateClasse.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            toast.success("Classe mise a jour");
            form.reset();
            onSuccess?.();
          },
          onError: (err) => {
            console.error(err);
            toast.error("Erreur lors de la modification");
          },
        }
      );
    } else {
      createClasse.mutate(data, {
        onSuccess: () => {
          toast.success("Classe créée !");
          form.reset();
          onSuccess?.();
        },
        onError: (err) => {
          console.error(err);
          toast.error("Erreur lors de la creation");
        },
      });
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
          name="cycle"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Cycle scolaire</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "null" || Number(value) === 0 ? null : Number(value))
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
                    {cyclesData?.map((cycle) => (
                      <SelectItem key={cycle.id} value={`${cycle.id}`}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }}
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
            );
          }}
        />
        <div className="mt-4">
          <Button
            type="submit"
            disabled={
              !formState.isDirty || !formState.isValid || formState.isSubmitting
            }
            className="w-full"
          >
            {isPending
              ? "Enregistrement..."
              : initialData
              ? "Modifier"
              : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
