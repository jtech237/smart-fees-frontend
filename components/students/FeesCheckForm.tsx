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

const schema = z.object({
  matricule: z.string().min(1, "Veuillez entrer le matricule de l'eleve"),
  year: z.string().regex(/^(19|20)\d{2}$/, "Veuillez saisir une annee valide"),
});

export const FeesCheckForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      matricule: "",
      year: "",
    },
  });
  return (
    <>
      <Form {...form}>
        <form action="">
          <FormField
            control={form.control}
            name="matricule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Annee scolaire</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant={"secondary"} className="w-full">
            Rechercher
          </Button>
        </form>
      </Form>
    </>
  );
};
