import React from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../schemas";
import { fieldsetClasses, gridClasses, legendClasses } from "./form-styles";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";

export const Step2 = React.memo(() => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  /* const LANG_OPTIONS = useMemo(
    () => [
      { value: "fr", label: "Français" },
      { value: "en", label: "Anglais" },
    ],
    []
  ); */
  return (
    <div className="gap-y-6">
      <h2 className="text-2xl font-bold">Informations personnelles</h2>

      <div className={gridClasses}>
        <fieldset className={fieldsetClasses}>
          <legend className={legendClasses}>Identification</legend>
          {/* Sexe */}
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-4 gap-y-0">
                <FormLabel>Sexe</FormLabel>
                <FormControl className="flex gap-x-3">
                  <RadioGroup
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center gap-x-3 gap-y-0">
                      <FormControl>
                        <RadioGroupItem value="M" />
                      </FormControl>
                      <FormLabel>Masculin</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center gap-x-3 gap-y-0">
                      <FormControl>
                        <RadioGroupItem value="F" />
                      </FormControl>
                      <FormLabel>Feminin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom et prenoms */}
          <FormField
            control={control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prenom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date et lieu de naissance */}
          <FormField
            control={control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Date de naissance</FormLabel>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  error={!!errors.birthday}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="placeOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de naissance</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Localisation */}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville de residence</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationalite</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className={fieldsetClasses}>
          <legend className={legendClasses}>Contact</legend>
          Communication et contact
          <div className="grid">
            <FormField
              control={control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Première langue parlée :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    defaultValue="fr"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { lang: "Francais", code: "fr" },
                        { lang: "Anglais", code: "en" },
                      ].map((value) => (
                        <SelectItem key={value.code} value={value.code}>
                          {value.lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="secondLang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deuxième langue parlée :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={"en"}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { lang: "Francais", code: "fr" },
                        { lang: "Anglais", code: "en" },
                      ].map((value) => (
                        <SelectItem key={value.code} value={value.code}>
                          {value.lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
});

Step2.displayName = "Step2";
