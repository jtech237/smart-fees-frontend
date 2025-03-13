"use client";


import ClasseForm from '@/components/classes/ClasseForm';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import type { Classe } from '@/types/classes';
import { ColumnDef } from '@tanstack/react-table';
import { useClasses } from '@/lib/api/classes';
import ClasseActions from '@/components/classes/ClasseActions';
import { useState } from 'react';

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
    cell: ({ row }) => (
      <ClasseActions classe={{ id: row.original.id, name: row.original.name, parent: row.original.parent?.id }} />
    ),
  },
];

export default function ClasseListPage() {
  const {data, isLoading, error} = useClasses()
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Liste des classes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Ajouter une classe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer une nouvelle classe</DialogTitle>
            </DialogHeader>
            <ClasseForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data || []}
        error={error?.message}
        isLoading={isLoading}
        enableSorting
        enableFilter
        enablePagination
        searchableColumns={["id", "name"]}
      />
    </div>
  );
}
