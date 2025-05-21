import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";

const currentYear = new Date().getFullYear();
const schema = z.object({
  matricule: z.string().trim().min(1, "Matricule requis"),
  year: z.string()
  .regex(/^(19|20)\d{2}$/, "Veuillez saisir une annee valide"),
});

type FormValues = z.infer<typeof schema>;

export const FeesCheckForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: useMemo(() => ({ matricule: "", year: "" }), []),
  });

  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Données validées:", values);
    } catch (error) {
      console.error("Erreur:", error);
    }
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="matricule"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="matricule">Matricule</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="matricule"
                    placeholder="EX12345"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="matricule-error"
                  />
                </FormControl>
                <FormMessage id="matricule-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="year">Année scolaire</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="year"
                    inputMode="numeric"
                    placeholder={`Ex: ${currentYear}`}
                    min={1900}
                    max={currentYear + 1}
                    aria-invalid={fieldState.invalid}
                    aria-describedby="year-error"
                  />
                </FormControl>
                <FormMessage id="year-error" />
              </FormItem>
            )}
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
