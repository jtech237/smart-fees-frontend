import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useClasses, useRequiredDocuments } from "@/lib/api/classes";
import { Select } from "@/components/ui/select";
import { useCycles } from "@/lib/api/cycles";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormValues } from "../schemas";

export const Step3 = React.memo(() => {
  const { control } = useFormContext<FormValues>();
  const [cycleId] = useWatch({ control, name: ["cycle"] });
  const [classeId] = useWatch({control, name: ['classe']})

  const { data: cycles, } = useCycles();
  const { data: classes,  } = useClasses(
    {cycle_id: Number(cycleId), orphan: true},
  );

  const classOptions = useMemo(() =>
    classes?.map(c => ({ value: c.id.toString(), label: c.name })) || [],
    [classes]
  );

   const { data: requiredDocs = [] } = useRequiredDocuments({
      classeId: classeId,
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
                  {classOptions.length > 0 ? (
                    classOptions.map((classe, idx) => (
                      <SelectItem key={idx} value={`${classe.value}`}>
                        {classe.label}
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
});

Step3.displayName = "Step3"

