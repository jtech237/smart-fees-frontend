import React from "react";
import { useFormContext } from "react-hook-form";
import { useClasse } from "@/lib/api/classes";
import { Skeleton } from "@/components/ui/skeleton";
import { FormValues } from "../schemas";
import { format } from "date-fns";

export const Step4 = React.memo(() => {
  const { watch } = useFormContext<FormValues>();
  const values = watch();
  const { data: classe, isLoading } = useClasse(values.classe);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vérification</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Identité</h3>
          <DataField label="Nom" value={`${values.lastname} ${values.firstname}`} />
          <DataField label="Date de naissance" value={format(values.birthday, "dd/mm/yyyy")} />
        </div>

        {isLoading ? (
          <Skeleton className="h-[100px]" />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Formation</h3>
            <DataField label="Classe" value={classe?.name} />
            <DataField label="Cycle" value={classe?.cycle?.name} />
          </div>
        )}
      </div>
    </div>
  );
});
Step4.displayName = "Step4"

const DataField = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-center p-3 border rounded-lg">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);