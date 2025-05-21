import { z } from "zod";

// Schémas par étape
export const step1Schema = z.object({
  accept: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les CGU" }),
  }),
});

export const step2Schema = z.object({
  gender: z.enum(["M", "F"], {
    required_error: "Selectionner votre genre",
    invalid_type_error: "Genre invalide",
  }),
  lastname: z
    .string().trim()
    .min(1, { message: "Votre nom est requis" }),
  firstname: z.string().trim().optional(),
  birthday: z
    .date({
      required_error: "La date de naissance est requise",
      invalid_type_error: "Format de date invalide",
    })
    .refine(date => date <= new Date(), {
      message: "La date doit être dans le passé",
    }),
  placeOfBirth: z.string().min(1, "Champ requis"),
  city: z.string().min(1, "Champ requis"),
  country: z.string().min(1, "Champ requis"),
  lang: z.enum(["fr", "en"]).default("fr"),
  secondLang: z.enum(["fr", "en"]).optional(),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/, "Numéro invalide").optional(),
  address: z.string().optional(),
  email: z.string().email("Email invalide"),
});

export const step3Schema = z.object({
  cycle: z.number().positive(),
  classe: z.number(),
  entryDiploma: z.string().min(1, "Champ requis"),
  mention: z.string().optional(),
  year: z.string().trim().optional(),
  countryOrigin: z.string().optional(),
  obtainingInstitution: z.string().optional(),
});

// Tableau immuable
export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;

export type FormValues = z.infer<typeof fullSchema>;

export const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
