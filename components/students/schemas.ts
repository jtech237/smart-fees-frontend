import { z } from "zod"

// Schémas par étape
export const step1Schema = z.object({
  accept: z.literal(true, {errorMap: () => ({ message: "Vous devez accepter les CGU" })}),
})
export const step2Schema = z.object({
  firstname: z.string().min(1, "Prénom requis"),
  lastname: z.string().min(1, "Nom requis"),
})
export const step3Schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
})

// Tableau immuable
export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const

// Type final (intersection des étapes)
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never

export type FormValues = UnionToIntersection<
  z.infer<typeof stepSchemas[number]>
>

export const fullSchema = stepSchemas.reduce(
  (acc, s) => acc.merge(s),
  z.object({})
);