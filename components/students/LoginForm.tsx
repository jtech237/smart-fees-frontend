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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Veuillez saisir votre matricule",
      invalid_type_error: "Format de matricule invalide",
    })
    .min(1, "Veuillez saisir votre matricule"),
  password: z.string().min(1, "Veuillez saisir votre mot de passe"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: useMemo(
      () => ({
        username: "",
        password: "",
      }),
      []
    ),
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const handleAuthError = useCallback(
    (message: string) => {
      toast.error(message);
      form.setFocus("username");
      setIsSubmitting(false);
    },
    [form]
  );

  const onSubmit: SubmitHandler<LoginFormValues> = useCallback(
    async (data) => {
      console.log(data);
      try {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
          ...data,
          redirect: false,
        });
        console.log(result)
        if (!result?.ok) {
          const errorMessage =
            result?.error === "CredentialsSignin"
              ? "Identifiants incorrects"
              : "Erreur de connexion";
          handleAuthError(errorMessage);
          return;
        }
        if(result.error){
          const errorMessage =
            result?.error === "CredentialsSignin"
              ? "Identifiants incorrects"
              : "Erreur de connexion";
          handleAuthError(errorMessage);
          return;
        }
        toast.success("Connexion réussie");
      } catch (error) {
        handleAuthError("Erreur inattendue");
        console.error("Login error:", error);
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleAuthError]
  );

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role !== "STUDENT") {
        signOut({ redirect: false });
      } else {
        router.push("/students");
      }
    }
  }, [router, session?.user.role, status]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="username"
                    aria-describedby="username-error"
                    aria-invalid={fieldState.invalid}
                    placeholder="Entrez votre matricule"
                  />
                </FormControl>
                <FormMessage id="username-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="flex space-y-3 flex-col mt-3">
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="password-error"
                    type="password"
                    placeholder="*******"
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || status === "loading"}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Se connecter
          </Button>
        </form>
      </Form>
    </>
  );
};
