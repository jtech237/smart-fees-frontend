"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateClassroom, useUpdateClassroom } from "@/lib/api/classrooms";
import { useClasses } from "@/lib/api/classes";

const classroomSchema = z.object({
  name: z.string().min(3, "Le nom est trop court."),
  classe: z.number().int(),
});

type ClassroomDataType = z.infer<typeof classroomSchema>;
type Props = {
  initialData?: { id: number; name: string; classe: number };
  onSuccess?: () => void;
};

export default function ClassroomForm({ initialData, onSuccess }: Props) {
  const form = useForm({
    resolver: zodResolver(classroomSchema),
    defaultValues: initialData
      ? initialData
      : {
          name: "",
        },
  });

  const createClassroom = useCreateClassroom();
  const updateClassroom = useUpdateClassroom();
  const { data: classes } = useClasses({ orphan: true });

  const isPending = createClassroom.isPending || updateClassroom.isPending;

  const onSubmit: SubmitHandler<ClassroomDataType> = async (data) => {
    if (initialData) {
      updateClassroom.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            toast.success("Salle mise a jour.");
            form.reset();
            onSuccess?.();
          },
          onError: (err) => {
            console.error(err);
            toast.error("Erreur lors de la modification.");
          },
        }
      );
    } else {
      createClassroom.mutate(data, {
        onSuccess: () => {
          toast.success("Salle cree");
          form.reset();
          onSuccess?.();
        },
        onError: (err) => {
          console.error(err);
          toast.error("Erreur lors de la creation.");
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
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
          render={({ field }) => (
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
                    <SelectValue placeholder="Selectionner une classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(classes || []).map((classe) => (
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
            disabled={!form.formState.isValid || form.formState.isSubmitting}
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
