"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteItem, fetchData } from "@/lib/api-crud";
import { Classroom, ClassroomListResponse } from "@/types/classrooms";
import { ColumnDef } from "@tanstack/react-table";
import ClassroomForm from "@/components/classes/ClassroomForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const columns: ColumnDef<Classroom>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nom de las salle" },
  {
    accessorKey: "classe.name",
    id: "classe_name",
    header: "Classe",
    cell: ({ row }) => row.original.classe.name,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const classroom = {
        id: row.original.id,
        name: row.original.name,
        classe: row.original.classe.id,
      };

      return (
        <div className="flex gap-x-2 justify-center items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier {classroom.name}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <ClassroomForm
                  initialData={classroom}
                  onSuccess={() => window.location.reload()}
                />
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Voulez-vous vraiment supprimer la salle de classe?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                {"Cette suppression entrainera une suppression plus ou moins importante dans l'application."}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        await deleteItem("/classrooms", classroom.id);
                        toast.success("Salle supprimee !");
                        window.location.reload();
                      } catch (error) {
                        console.error("Erreur lors de la suppression", error);
                        toast.error("Erreur lors de la suppression");
                      }
                    }}
                  >
                    Confirmer
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default function ClassroomListPage() {
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClassrooms() {
      try {
        setLoading(true);
        const res = await fetchData<ClassroomListResponse>("/classrooms", {});
        setClassrooms(res.data);
      } catch (err) {
        console.error("Erreur API: ", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    loadClassrooms();
  }, []);
  return (
    <>
      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2>Liste des salles de classes</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Ajouter une salle de classe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Creer une nouvelle salle de classe</DialogTitle>
              </DialogHeader>
              <ClassroomForm onSuccess={() => window.location.reload()} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={classrooms}
          error={error}
          isLoading={loading}
          searchableColumns={["id", "name"]}
          enableFilter
          enablePagination
          enableSorting
        />
      </div>
    </>
  );
}
