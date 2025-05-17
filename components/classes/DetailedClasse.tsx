"use client";
import { useClasse } from "@/lib/api/classes";
import { useEffect } from "react";

export const DetailedClasse: React.FC<{
  id: number;
}> = ({ id }) => {
  const { data: classe, isLoading, error } = useClasse(id);

  useEffect(() => {
    if (!isLoading && classe) {
      document.title = "Details de la classe " + classe?.name;
    } else {
      document.title = "Loading...";
    }
  }, [classe, isLoading]);

  return isLoading ? (
    <div>CHargement...</div>
  ) : error ? (
    <div>Error: {error.message}</div>
  ) : (
    <div>

    </div>
  );
};
