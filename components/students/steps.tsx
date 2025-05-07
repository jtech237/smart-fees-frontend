import React from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormValues } from "./schemas";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar1Icon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const Step1: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-lg font-medium">CGU</h2>
      <p className="mt-2 text-sm">
        {/* ton long texte ici */}
        <p>
          <span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid
            explicabo quidem maiores magnam rem expedita error rerum harum, eius
            ab laborum molestias porro eum officiis, inventore soluta quo
            mollitia laboriosam.
          </span>
          <span>
            Dolores saepe optio repudiandae? Nihil laborum tenetur cumque
            deleniti et modi sunt delectus neque sed porro eum eos, ipsum
            commodi ut, quisquam excepturi quaerat nulla aliquam dolorum soluta
            vitae. Quo.
          </span>
          <span>
            Quam molestias, velit magnam odio nesciunt optio ullam harum
            deleniti! Culpa, modi. Ex sapiente veniam dolore minima doloribus
            voluptatem vitae facilis veritatis ipsam amet cumque at, quibusdam
            nostrum tempore commodi.
          </span>
          <span>
            Quidem soluta fugiat ab consequatur iure aliquid exercitationem
            magnam earum sint vero, saepe nihil voluptatem, debitis odio
            nesciunt doloribus qui est amet harum expedita facilis ut error
            explicabo. Ipsum, rerum!
          </span>
          <span>
            Eligendi facilis nihil dicta consequatur repellat, vel nam maiores
            ratione dolores dolorem aliquam rem ipsam consectetur voluptate ea
            alias enim hic reiciendis excepturi quaerat distinctio saepe velit?
            Iste, sit. Facilis.
          </span>
          <span>
            Unde fugiat placeat illo eius asperiores explicabo expedita libero
            laudantium aspernatur dicta sint, recusandae magnam dolor nemo omnis
            accusantium itaque dolorum veritatis? Illum dicta nihil obcaecati
            ratione, quasi veritatis natus.
          </span>
          <span>
            Iure ex pariatur unde ut deserunt rerum nihil, maiores debitis sed
            animi minima ad illum illo velit accusantium architecto laborum
            aperiam nam nemo similique earum. Accusantium id aspernatur sed
            eligendi!
          </span>
          <span>
            Repellendus sint iste officia praesentium, excepturi eveniet? Sequi,
            nobis? Eligendi veritatis, excepturi corrupti sunt adipisci minus
            deserunt recusandae esse et ab, quaerat cupiditate. Dolore optio
            minus hic reprehenderit harum esse?
          </span>
          <span>
            Consequuntur adipisci eveniet culpa voluptate quae voluptatum,
            dolorem rerum fugit fuga corporis sunt ea ipsa ut, maiores error at
            atque, facilis cupiditate possimus repellat laudantium aliquid. Quas
            minima assumenda cupiditate?
          </span>
          <span>
            Repellat, id doloremque optio possimus commodi exercitationem neque
            quis ad at voluptate accusamus facere animi placeat sint molestiae
            autem modi saepe quod minima? Fuga iusto possimus molestiae odio
            reprehenderit sed?
          </span>
        </p>
      </p>
      <FormField
        control={control}
        name="accept"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Accepter</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const Step2: React.FC = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div>
      <h2 className="text-lg font-medium">Informations personnelles</h2>
      <div className="grid md:grid-cols-2 gap-x-4">
        <fieldset>
          <legend>Identification</legend>
          {/* Sexe */}
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4 space-y-0">
                <FormLabel>Sexe</FormLabel>
                <FormControl className="flex space-x-3">
                  <RadioGroup
                    onChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="M" />
                      </FormControl>
                      <FormLabel>Masculin</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
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
            name="lastName"
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
            name="firstName"
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
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selectionner une date</span>
                        )}
                        <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
        <fieldset>
          <legend>Communication et contact</legend>
          <div className="grid">
            <FormField
              control={control}
              name="lang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Première langue parlée :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                      ].map((value, idx) => (
                        <SelectItem key={idx} value={value.code}>
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { lang: "Anglais", code: "en" },
                        { lang: "Francais", code: "fr" },
                      ].map((value, idx) => (
                        <SelectItem key={idx} value={value.code}>
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
};

export const Step3: React.FC = () => {
  const {
    control} = useFormContext<FormValues>();

  return (
    <div className="grid md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-2">
      <fieldset>
        <legend>Choix de la classe</legend>
        {/* Cycle */}
      <FormField
        control={control}
        name="cycle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cycle</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un cycle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {["1er Cycle", "2ème Cycle", "3ème Cycle"].map((value, idx) => (
                  <SelectItem key={idx} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Classe */}
      <FormField
        control={control}
        name="classe_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Classe</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      </fieldset>
      <fieldset className="col-start-1 row-start-2">
        <legend>Pièces à completer pour la formation</legend>
      </fieldset>
      <fieldset className="row-span-2 col-start-2 row-start-1">
        <legend>Information de qualification</legend>
        <FormField
          control={control}
          name="entryDiploma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diplome d'entrée</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <FormField
          control={control}
          name="mention"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mention</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année d'obtention</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="countryOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays d'obtention</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="obtainingInstitution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution d'obtention</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </fieldset>
    </div>
  );
};

export const Step4: React.FC = () => {
  return (
    <div>
      {/* Affichage des donnees et confirmation */}
    </div>
  )
}
