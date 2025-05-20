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
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z
    .string({
      required_error: "Veuillez saisir votre matricule",
      description:
        "Le matricule est votre identifiant. Si vous l'avez perdu, cliquez sur l'onglet MATRICULE",
    })
    .min(1, "Veuillez saisir votre matricule"),
  password: z
    .string({ required_error: "Veuillez remplir ce champ" })
    .min(2, "Veuillez saisir votre mot de passe."),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const { data: session } = useSession();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    console.log(data);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      const code = result?.code;
      if (code === "unauthorized" || code === "invalid_credentials") {
        form.setError("root", {
          message: "Matricule ou mot de passe incorrect",
        });
        form.setFocus("username");
        return;
      }

      if (code === null) {
        setAuthenticated(true);
      }
    } catch (error) {
      form.setError(`root`, {
        message: "Unknown error occurred",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setAuthenticated(true);
    } else if (session?.user.role !== "STUDENT") {
      signOut({ redirect: false })
      form.setError("root", {
        message: "Vous n'avez pas acces a cette partie du site",
      });
      setAuthenticated(false);
    }
  }, [form, session]);
  useEffect(() => {
    if (authenticated) {
      router.push("/students");
    }
  }, [authenticated, router]);

  useEffect(() => {
    if (form.formState.errors.root) {
      toast.error(form.formState.errors.root.message);
    }
  }, [form.formState.errors.root]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root?.message && (
            <p
              role="alert"
              className="p-4 bg-destructive text-destructive-foreground"
            >
              {form.formState.errors.root.message}
            </p>
          )}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Entrez votre matricule" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex space-y-3 flex-col mt-3">
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="*******" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center mt-2">
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting || authenticated}
            >
              Se connecter
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
