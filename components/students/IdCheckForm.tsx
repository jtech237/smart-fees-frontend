import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { Loader2 } from "lucide-react";

const schema = z.object({
  fullname: z.string().trim().min(1, "Veuillez entrer votre nom complet"),
  birthday: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Format invalide (jj/mm/aaaa ex: 01/04/2000)"
    )
    .refine((value) => {
      const [day, month, year] = value.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime());
    }, "Date invalide"),
});

type FormValues = z.infer<typeof schema>;

export const IdCheckForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: "",
      birthday: undefined,
    },
    mode: "onTouched",
  });

  const handleSubmit: SubmitHandler<FormValues> = useCallback(
    async (values) => {
      try {
        // Convertir la date manuellement
        const [day, month, year] = values.birthday.split("/");
        const dateObj = new Date(`${year}-${month}-${day}`);

        if (isNaN(dateObj.getTime())) {
          form.setError("birthday", {
            type: "manual",
            message: "Date invalide",
          });
          return;
        }

        // Simuler appel API avec l'objet Date
        console.log("Date convertie:", dateObj);
      } catch (error) {
        console.error("Erreur:", error);
      }
    },
    [form]
  );

  return (
    <>
      <Form {...form}>
        <form
          noValidate
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="fullname"
                    placeholder="Jean Dupont"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="fullname-error"
                  />
                </FormControl>
                <FormMessage id="fullname-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field, fieldState }) => {
              const handleDateInput = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                let value = e.target.value;

                // Nettoyer et formater la saisie
                value = value
                  .replace(/\D/g, "") // Supprimer tout sauf les chiffres
                  .replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, (_, d, m, y) => {
                    const parts = [];
                    if (d) parts.push(d);
                    if (m) parts.push(m);
                    if (y) parts.push(y);
                    return parts.join("/");
                  })
                  .slice(0, 10); // Limiter à jj/mm/aaaa (10 caractères)

                field.onChange(value);
              };

              const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                const value = e.target.value;

                // Valider le format complet avant padding
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                  form.setError("birthday", {
                    type: "manual",
                    message: "Date incomplète",
                  });
                  field.onChange(""); // Réinitialiser si invalide
                  return;
                }

                // Padding des zéros uniquement si nécessaire
                const [day, month, year] = value.split("/");
                const paddedDay = day.padStart(2, "0");
                const paddedMonth = month.padStart(2, "0");
                const formattedDate = `${paddedDay}/${paddedMonth}/${year}`;

                // Validation finale de la date réelle
                const dateObj = new Date(`${year}-${paddedMonth}-${paddedDay}`);
                if (isNaN(dateObj.getTime())) {
                  form.setError("birthday", {
                    type: "manual",
                    message: "Date invalide",
                  });
                  field.onChange(formattedDate); // Afficher la version formatée
                } else {
                  field.onChange(formattedDate); // Conserver la valeur valide
                }
              };

              return (
                <FormItem className="mb-2">
                  <FormLabel>Date de naissance</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="birthday"
                      placeholder="jj/mm/aaaa"
                      autoComplete="bday"
                      aria-invalid={fieldState.invalid}
                      aria-describedby="birthday-error"
                      onChange={handleDateInput}
                      onBlur={handleBlur}
                      type="text"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage id="birthday-error" />
                </FormItem>
              );
            }}
          />

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Rechercher
          </Button>
        </form>
      </Form>
    </>
  );
};
