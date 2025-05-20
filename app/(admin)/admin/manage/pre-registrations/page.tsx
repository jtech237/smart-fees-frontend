"use client"
import DataTable from "@/components/data-table";
import { usePreRegistrations } from "@/lib/api/students";
import { Registration } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Registration>[] = [
  { accessorKey: "id", header: "ID" },
  {
    id: "fullname",
    header: "Nom et prenoms",
    cell: ({ row }) =>
      `${row.original.student.firstname.toUpperCase()} ${
        row.original.student.lastname
      }`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => <span>{row.original.status}</span>
  }
];

export default function ManagePreRegistrationPage() {
  const {
    data: registrations,
    isLoading,
    error,
    refetch,
  } = usePreRegistrations();
  return <>
    <DataTable columns={columns} retryFunction={refetch} data={registrations?.items || []} isLoading={isLoading} />
  </>;
}
