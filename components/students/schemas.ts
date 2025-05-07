import { z } from "zod";

// Schémas par étape
export const step1Schema = z.object({
  accept: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les CGU" }),
  }),
});
export const step2Schema = z.object({
  gender: z.enum(["M", "F"], {
    required_error: "Select your genre",
    invalid_type_error: "Genre invalide",
  }),
  lastName: z
    .string({ required_error: "Votre nom est requis" })
    .min(1, { message: "Votre nom est requis" }),
  firstName: z.string().optional(),
  birthdate: z.date().superRefine((val, ctx) => {
    if (val >= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message:
          "Date invalide. Vous date de naissance doit être dans le passé",
      });
    }
  }),
  placeOfBirth: z.string(),
  city: z.string(),
  country: z.string(),
  lang: z.enum(["fr", "en"]).default("fr").optional(),
  secondLang: z.enum(["fr", "en"]).default("fr").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string({required_error: "Adresse email requise"}).email("Email invalide"),
});
export const step3Schema = z.object({
  cycle: z.enum(["1er Cycle", "2ème Cycle", "3ème Cycle"]),
  classe_id: z.number().int(),
  entryDiploma: z.string().optional(),
  mention: z.string().optional(),
  year: z.enum(["2023", "2024"]),
  countryOrigin: z.string().optional(),
  obtainingInstitution: z.string().optional(),
});

// Tableau immuable
export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;

// Type final (intersection des étapes)
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type FormValues = UnionToIntersection<
  z.infer<(typeof stepSchemas)[number]>
>;

export const fullSchema = stepSchemas.reduce(
  (acc, s) => acc.merge(s),
  z.object({})
);
