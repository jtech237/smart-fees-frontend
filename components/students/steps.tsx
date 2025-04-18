import React from "react"
import { useFormContext } from "react-hook-form"
import { Checkbox } from "../ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { FormValues } from "./schemas"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"

export const Step1: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div>
      <h2 className="text-lg font-medium">CGU</h2>
      <p className="mt-2 text-sm">
        {/* ton long texte ici */}
      </p>
      <FormField
        control={control}
        name="accept"
        render={({field}) => (
          <FormItem className="flex items-center space-x-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
            </FormControl>
            <FormLabel>Accepter</FormLabel>
          </FormItem>
        )}
      />
      {errors.accept && (
        <p className="text-red-600 text-sm mt-1">
          {errors.accept.message as string}
        </p>
      )}
    </div>
  )
}


export const Step2: React.FC = () => {
  const {
    control,
  } = useFormContext<FormValues>()

  return (
    <div>
      <h2 className="text-lg font-medium">Informations personnelles</h2>
      <div className="mt-4">
        <FormField
          control={control}
          name="firstname"
          render={({field, fieldState}) => (
            <FormItem>
              <FormLabel className={cn(
                  fieldState.invalid && "text-rose-600"
                )}>Prenom: </FormLabel>
              <FormControl>
                <Input {...field} className={cn(
                  fieldState.invalid && "border-destructive focus:outline-destructive"
                )}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-4">
        <FormField
          control={control}
          name="lastname"
          render={({field, fieldState}) => (
            <FormItem>
            <FormLabel className={cn(
                fieldState.invalid && "text-rose-600"
              )}>Nom: </FormLabel>
              <FormControl>
                <Input {...field} className={cn(
                  fieldState.invalid && "border-destructive"
                )}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export const Step3: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div>
      <h2 className="text-lg font-medium">Connexion</h2>
      <div className="mt-4">
        <label className="block">
          Email
          <input type="email" {...register("email")} className="mt-1 input" />
        </label>
        {errors.email && (
          <p className="text-red-600 text-sm">
            {errors.email.message as string}
          </p>
        )}
      </div>
      <div className="mt-4">
        <label className="block">
          Mot de passe
          <input
            type="password"
            {...register("password")}
            className="mt-1 input"
          />
        </label>
        {errors.password && (
          <p className="text-red-600 text-sm">
            {errors.password.message as string}
          </p>
        )}
      </div>
    </div>
  )
}
