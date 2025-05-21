import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@radix-ui/react-checkbox";
import React from "react";
import { useFormContext } from "react-hook-form";

export const Step1 = React.memo(() => {
  const {control} = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">CGU</h2>

      <div className="prose max-h-[400px] overflow-y-auto">
        {/* Contenu des CGU ici */}
      </div>

      <FormField
        control={control}
        name="accept"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-3 border-t pt-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-labelledby="accept-label"
              />
            </FormControl>
            <FormLabel id="accept-label" className="!mt-0">
              {"J'accepte les conditions générales"}
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
})

Step1.displayName = "Step1"