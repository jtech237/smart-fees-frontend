"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Le champ utilisateur est requis")
    .refine((value) => value.includes("@") || value.length >= 4, {
      message:
        "Veuillez entrer un email valide ou un nom d'utilisateur de 4 caractères minimum",
    }),
  password: z.string().min(4, "Le mot de passe est trop court"),
});

const LoginPage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
    },
    criteriaMode: "all",
  });
  const onSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (
    data
  ) => {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      const code = result?.code;
      switch (code) {
        case "unauthorized":
          form.setError("root", {
            message: "Authentication failed. Check your credentials",
          });
          break;
        case "invalid_credentials":
          form.setError("root", {
            message: "Invalid credentials",
          });
          form.setFocus("username");
          break;
        case null:
          console.log("Authentication success");
          setAuthenticated(true);
          break;
        default:
          console.log(result);
          form.setError("root", {
            message: "Internal server error. Contact administrator",
          });
          console.error("Unknow");
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
    }
  }, [session]);

  useEffect(() => {
    if (authenticated) {
      const next = searchParams.get("next") || "/";
      router.replace(next);
    }
  }, [authenticated, router, searchParams]);

  useEffect(() => {
    if (form.formState.errors.root) {
      toast.error(form.formState.errors.root.message);
    }
  }, [form.formState.errors.root]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          {form.formState.errors.root?.message && (
            <p role="alert" className="text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}
          <FormField
            control={form.control}
            name="username"
            render={({ field, formState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    aria-invalid={!formState.isValid}
                    {...field}
                    placeholder="Username"
                    autoComplete="off"
                    className={cn(
                      "invalid:border-pink-500 invalid:text-pink-600focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <div className="text-sm">
                    <Link
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    id="password"
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                  />
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="mt-4">
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {form.formState.isSubmitting
                ? "Connexion en cours..."
                : "Sign in"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export { LoginPage };
