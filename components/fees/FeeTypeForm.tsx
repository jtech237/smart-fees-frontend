"use client";

import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, LoaderIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { FeeTypePayload, useCreateFeeType } from "@/lib/api/fees";
import { toast } from "sonner";
import { useBody } from "@/hooks/useBody";
import { createPortal } from "react-dom";

const feeTypeSchema = z
  .object({
    name: z.string().nonempty("Le nom est requis"),
    description: z.string().optional(),
    isDueDateFixed: z.boolean().default(false),
    dueDate: z.date().optional().nullable(),
  })
  .superRefine((schema, ctx) => {
    const isDueDateFixed = schema.isDueDateFixed;
    const dueDate = schema.dueDate;
    if (isDueDateFixed && !dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date limite est requise pour un type de frais avec une date limite fixe",
        path: ["dueDate"],
      });
    }
  });

export function FeeTypeForm({ onSuccess }: { onSuccess: () => void }) {
  const body = useBody();
  const [open, setOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(feeTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      isDueDateFixed: false,
      dueDate: null,
    },
  });

  const isDueDateFixed = form.watch("isDueDateFixed");
  const { mutateAsync: createFeeType } = useCreateFeeType();

  useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        description: "",
        isDueDateFixed: false,
        dueDate: null,
      });
    }
  }, [open, form]);

  const onSubmit: SubmitHandler<z.infer<typeof feeTypeSchema>> = (data) => {
    const dataToSnakeCase: FeeTypePayload = {
      name: data.name,
      description: data.description || undefined,
      is_due_date_fixed: data.isDueDateFixed,
      default_due_date: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") :  undefined,
    };
    const operation = createFeeType(dataToSnakeCase);

    toast.promise(operation, {
      loading: "Enregistrement en cours...",
      success: () => {
        onSuccess();
        setOpen(false);
        form.reset();
        return "Type de frais ajouté avec succès";
      },
      error: (error) => {
        return error.message || "Une erreur s'est produite";
      },
    });
  };

  if (!body) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="link"
        className="text-primary px-0"
        type="button"
      >
        + Ajouter un type de frais
      </Button>
      {body &&
        createPortal(
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau type de frais</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du type</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Frais de scolarite"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            {...field}
                            placeholder="Description detaillee du type de frais"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    className={cn(
                      "grid grid-cols-1 gap-4",
                      isDueDateFixed ?? "md:grid-cols-2"
                    )}
                  >
                    <FormField
                      control={form.control}
                      name="isDueDateFixed"
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            "flex flex-row items-center gap-2",
                            !field.value && "mb-3"
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked) {
                                  form.resetField("dueDate");
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Date limite fixe?</FormLabel>
                            <FormDescription>
                              Cochez cette case si ce type de frais a une date
                              limite fixe chaque année
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    {isDueDateFixed && (
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex items-center space-x-2 mb-3">
                              <FormLabel>Date limite par défaut</FormLabel>
                              <Popover
                                modal
                                open={datePickerOpen}
                                onOpenChange={setDatePickerOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "flex-grow pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(new Date(field.value), "PPP", {
                                          locale: fr,
                                        })
                                      ) : (
                                        <span>Sélectionner une date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-full p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      field.onChange(date);
                                      setDatePickerOpen(false);
                                    }}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    defaultMonth={field.value || undefined}
                                    locale={fr}
                                    weekStartsOn={1}
                                    captionLayout="dropdown-buttons"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    )}
                  </div>
                  <Button
                    className="w-full mt-4"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>,
          body
        )}
    </>
  );
}
