"use client";

import { useEffect, useState } from 'react';

import ClasseForm from '@/components/classes/ClasseForm';
import DataTable from '@/components/data-table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { deleteItem, fetchData } from '@/lib/api-crud';
import { Classe, ClasseListResponse } from '@/types/classes';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

const columns: ColumnDef<Classe>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nom de la classe" },
  {
    accessorKey: "parent.name",
    id: "parent_name",
    header: "Classe parente",
    cell: ({ row }) => row.original?.parent?.name || "-/-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({row}) => {
      const classe = {
        name: row.original.name,
        id: row.original.id,
        parent: row.original.parent?.id
      }
      return (
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier {classe.name}</DialogTitle>
              </DialogHeader>
              <ClasseForm initialData={classe} onSuccess={() => window.location.reload()}/>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voulez-vous vraiment supprimer cette classe ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Supprimer cette classe entrainera la suppression des classes enfantes et toute autre relation avec cette classe.
                  Cette action est ireversible!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive" onClick={async () => {
                    try {
                      await deleteItem("/classes", classe.id)
                      toast.success("Classe supprimée !")
                      window.location.reload()
                    } catch (error) {
                      console.error("Erreur", error)
                      toast.error("Erreur lors de la suppression !")
                    }
                  }}>Supprimer</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  },
];

export default function ClasseListPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const data = await fetchData<ClasseListResponse>("/classes", {
          skip: (pagination.page - 1) * pagination.limit,
          limit: pagination.limit,
        });

        setClasses(data.data);
      } catch (err) {
        console.error("Erreur API :", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, [pagination]);


  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Liste des classes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Ajouter une classe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer une nouvelle classe</DialogTitle>
            </DialogHeader>
            <ClasseForm onSuccess={() => window.location.reload()}/>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={classes}
        error={error}
        isLoading={loading}
        enableSorting
        enableFilter
        enablePagination
        searchableColumns={["id", "name"]}
      />
    </div>
  );
}
