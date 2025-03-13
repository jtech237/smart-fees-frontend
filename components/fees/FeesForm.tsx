"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCurrentAcademicYear } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClasses } from "@/lib/api/classes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateFee,
  useFees,
  useFeeTypes,
  useUpdateFee,
} from "@/lib/api/fees";
import { useEffect, useState } from "react";
import { Fee, FeeType } from "@/types/fees";
import moment from "moment";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FeeTypeForm } from "./FeeTypeForm";
import { useQueryClient } from "@tanstack/react-query";

moment.locale("fr");

const feeSchema = z.object({
  classe: z.number().int().positive("Sélectionnez une classe"),
  feesType: z.number().int().positive("Sélectionnez un type de frais"),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Format requis: AAAA-AAAA"),
  amount: z.number().positive("Le montant doit être positif"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .refine(
      (val) => !val || new Date(val) > new Date(),
      "La date doit être dans le futur"
    )
    .optional(),
});

type Props = {
  initialData?: z.infer<typeof feeSchema> & { id: number };
  onSuccess?: () => void;
};

export default function FeesForm({ initialData, onSuccess }: Props) {
  const academicYear = getCurrentAcademicYear();
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType | null>(null);
  const [existingFee, setExistingFee] = useState<Fee| null>(null);
  const [today] = useState(format(new Date(), "yyyy-MM-dd"));

  const queryClient = useQueryClient()
  const { mutateAsync: createFee, isPending: updateIsPending } = useCreateFee();
  const { mutateAsync: updateFee, isPending: createIsPending } = useUpdateFee();

  const form = useForm<z.infer<typeof feeSchema>>({
    resolver: zodResolver(feeSchema),
    defaultValues: initialData || {
      academicYear,
      description: "",
      amount: 0,
    },
  });

  const { formState } = form;

  useEffect(() => {
    if (selectedFeeType?.defaultDueDate) {
      const defaultDate = format(
        new Date(selectedFeeType.defaultDueDate),
        "yyyy-mm-dd"
      );
      form.setValue("dueDate", defaultDate);
    }
  }, [selectedFeeType, form]);

  const { data: classes } = useClasses();
  const { data: feeTypes } = useFeeTypes();
  const isPending = initialData ? updateIsPending : createIsPending;

  const { data: existingFees } = useFees({
    classe: form.watch("classe"),
    fee_type: form.watch("feesType"),
    limit: 1,
  });

  useEffect(() => {
    if (form.watch("classe") && form.watch("feesType") && !initialData) {
      const fee = existingFees?.items[0];
      if (fee) {
        setExistingFee(fee);
        form.reset({
          ...form.getValues(),
          amount: fee.amount,
          description: fee.description,
          dueDate: fee.dueDate ? fee.dueDate.toLocaleString() : undefined,
        });
        toast.info(
          "Un frais similaire existe déjà pour cette classe et ce type de frais"
        );
      } else {
        setExistingFee(null);
      }
    }
  }, [existingFees, form, initialData]);

  const onSubmit: SubmitHandler<z.infer<typeof feeSchema>> = (data) => {
    const dataToSnakeCase = {
      amount: data.amount,
      classe: data.classe,
      description: data.description,
      due_date: data.dueDate,
      fees_type_id: data.feesType,
      academic_year: data.academicYear,
    };
    const operation = initialData?.id
      ? updateFee({ id: initialData.id, ...dataToSnakeCase })
      : createFee(dataToSnakeCase);

    toast.promise(operation, {
      loading: "En cours...",
      success: () => {
        form.reset();
        console.log("Here", onSuccess);
        onSuccess?.();
        return initialData?.id
          ? "Frais mis à jour avec succès"
          : "Frais créé avec succès";
      },
      error: (err) => {
        console.error("Erreur: ", err);
        return err.response?.data?.message || "Une erreur est survenue";
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {formState.errors.root?.message && (
          <p role="alert" className="text-destructive-foreground">
            {formState.errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="classe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classe</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Aucune</SelectItem>
                    {classes?.map((classe) => (
                      <SelectItem
                        key={`form-classe-${classe.id}`}
                        value={`${classe.id}`}
                      >
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Année Académique */}
          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Année Académique</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Type de Frais */}
          <FormField
            control={form.control}
            name="feesType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de frais</FormLabel>
                <div className="flex flex-col">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      const type = feeTypes?.find(
                        (t) => t.id === Number(value)
                      );
                      setSelectedFeeType(type || null);
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feeTypes?.map((feeType) => (
                        <SelectItem
                          key={`form-type-${feeType.id}`}
                          value={`${feeType.id}`}
                        >
                          {feeType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FeeTypeForm
                    onSuccess={() => {
                      queryClient.invalidateQueries(["fee-types"]);
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Montant */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value === 0 ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Limite Conditionnelle */}
        {selectedFeeType?.isDueDateFixed && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date limite</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={today}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Envoi en cours..." : existingFee || initialData ? "Modifier" : "Créer"}
        </Button>
      </form>
    </Form>
  );
}
