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
  fullname: z.string().min(1, "Veuillez entrer votre nom complet"),
  birthday: z
    .string()
    .regex(
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
      "Entrer une date valide au format dd/mm/yyyy. Ex: 01/12/2000"
    ),
});

export const IdCheckForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: "",
      birthday: "",
    },
  });
  return (
    <>
      <Form {...form}>
        <form action="">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: 01/04/2000" />
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
