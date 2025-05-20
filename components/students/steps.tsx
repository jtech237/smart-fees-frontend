"use client";

import React, { useState } from "react";
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
import { cn, getCurrentAcademicYear } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar1Icon, CheckCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCycles } from "@/lib/api/cycles";
import { useClasse, useClasses, useRequiredDocuments } from "@/lib/api/classes";

export const Step1: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-lg font-medium">CGU</h2>
      <div className="mt-2 text-sm">
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
      </div>
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
        <fieldset className="p-4 shadow-sm border">
          <legend className="px-2 text-lg font-semibold">Identification</legend>
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
        <fieldset className="p-4 shadow-sm border">
          <legend className="px-2 text-lg font-semibold">
            Communication et contact
          </legend>
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
};

export const Step3: React.FC = () => {
  const { control } = useFormContext<FormValues>();

  const { data: cycles } = useCycles();
  const [cycleId, setCycleId] = useState<number | undefined>(undefined);
  const [classeId, setClasseId] = useState<number | undefined>(undefined);

  const { data: classes = [] } = useClasses({
    cycle_id: cycleId,
    orphan: true,
  });

  const { data: requiredDocs = [] } = useRequiredDocuments({
    classeId: classeId as number,
  });

  return (
    <div className="grid md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-2">
      <fieldset className="p-4 shadow-sm border">
        <legend className="px-2 text-lg font-semibold">
          Choix de la classe
        </legend>
        {/* Cycle */}
        <FormField
          control={control}
          name="cycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycle</FormLabel>
              <Select
                onValueChange={(v) => {
                  const cycleId = v ? Number(v) : undefined;
                  setCycleId(cycleId);
                  field.onChange(cycleId);
                }}
                value={field.value ? `${field.value}` : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un cycle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.map((value, idx) => (
                    <SelectItem key={idx} value={value.id.toString()}>
                      {value.name}
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
          name="classe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe souhaitee</FormLabel>
              <Select
                onValueChange={(v) => {
                  const classeId = v ? Number(v) : undefined;
                  setClasseId(classeId);
                  field.onChange(classeId);
                }}
                value={field.value ? `${field.value}` : undefined}
                disabled={!cycleId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        cycleId
                          ? "Selectionner une classe"
                          : "Choisir un cycle d'abord"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.length > 0 ? (
                    classes.map((value, idx) => (
                      <SelectItem key={idx} value={`${value.id}`}>
                        {value.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Aucune classe disponible
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </fieldset>
      <fieldset className="p-4 shadow-sm border col-start-1 row-start-2">
        <legend className="px-2 text-lg font-semibold">
          Pièces à completer pour la formation
        </legend>
        {requiredDocs.length > 0 ? (
          <ol className="list-decimal list-inside">
            {requiredDocs.map((req, idx) => (
              <li key={idx}>
                <span>{req.name}</span>
                <p>{req.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p>Aucun document requis pour cette classe</p>
        )}
      </fieldset>
      <fieldset className="p-4 shadow-sm border row-span-2 col-start-2 row-start-1">
        <legend className="px-2 text-lg font-semibold">
          Information de qualification
        </legend>
        <FormField
          control={control}
          name="entryDiploma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diplome d&apos;entrée</FormLabel>
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
              <FormLabel>{"Année d'obtention"}</FormLabel>
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
              <FormLabel>{"Pays d'obtention"}</FormLabel>
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
              <FormLabel>{"Institution d'obtention"}</FormLabel>
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
  const form = useFormContext<FormValues>();
  const data = form.getValues();
  const { data: classe } = useClasse(data.classe);
  return (
    <div className="border border-gray-600 dark:border-gray-300">
      <h2>Verification des donnees</h2>
      <p>Verifiez vos donnees</p>
      {/* <!-- Entete et identification --> */}
      <div className="flex items-center space-x-4 p-4">
        <div className="h-30 w-30 border border-blue-500 bg-blue-400 dark:bg-blue-300"></div>
        <div className="">
          <div className="grid grid-cols-12">
            <div className="col-span-5 flex flex-col">
              <span>Monsieur</span>
              <span>Ne le</span>
              <span>Nationalite</span>
              <span>Ville de residence</span>
            </div>
            <div className="col-span-7 flex flex-col">
              <span>{`${data.lastname.toUpperCase()} ${data.firstname}`}</span>
              <span>{`${format(data.birthday, "d MMMM u")} a ${
                data.placeOfBirth
              }`}</span>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Cursus choisie --> */}
      <div className="p-4">
        <h3>Formation choisie</h3>
        <div className="grid grid-cols-9">
          <div className="col-span-4 flex flex-col">
            <span>Demande une inscription en classe de</span>
            <span>Pour le compte de l&apos;annee scolaire</span>
            <span>Avec pour diplôme d&apos;admission</span>
          </div>
          <div className="col-span-5 flex flex-col">
            <span>{classe?.name}</span>
            <span>{getCurrentAcademicYear()}</span>
            <span>{data.entryDiploma ? data.entryDiploma : "aucun"}</span>
          </div>
        </div>
      </div>
      {/* <!-- Contacts --> */}
      <div className="p-4">
        <h3>Contact et communications</h3>
        <div className="grid grid-cols-9">
          <div className="col-span-4 flex flex-col">
            <span>Adresse email</span>
            <span>Langues parlees</span>
          </div>
          <div className="col-span-5 flex flex-col">
            <span>{data.email}</span>
            <span>-</span>
          </div>
        </div>
      </div>
    </div>
  );
};
