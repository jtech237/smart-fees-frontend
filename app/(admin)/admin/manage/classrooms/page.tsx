"use client";

import ClassroomActions from "@/components/classes/ClassroomActions";
import ClassroomForm from "@/components/classes/ClassroomForm";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClassrooms } from "@/lib/api/classrooms";
import { Classroom } from "@/types/classrooms";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Classroom>[] = [
  {accessorKey: "id", header: "#"},
  {accessorKey: "name", header: "Nom de la salle"},
  {
    accessorKey: "classe.name",
    id: "owner",
    header: "Classe",
    cell: ({row}) => row.original?.classe.name
  },
  {
    id: "actions",
    header: () => (
      <div className="w-full text-center">Actions</div>
    ),
    cell: ({row}) => (
      <ClassroomActions classe={{id: row.original.id, name: row.original.name, classe: row.original.classe.id}}/>
    )
  }
]

export default function ClassroomsPage(){
  const {data, isLoading, error, refetch} = useClassrooms()
  console.log(data)
  return <div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="font-semibold">Liste des salles de classes</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Ajouter une salle</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creer une salle de classe</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <ClassroomForm/>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Button onClick={() => refetch()} variant={"link"}>Actualiser</Button>
    </div>

    <DataTable
      columns={columns}
      data={data || []}
      error={error?.message}
      isLoading={isLoading}
      searchableColumns={["id", "name"]}
      enableFilter
      enablePagination
      enableSorting
      retryFunction={refetch}
    />
  </div>
}
