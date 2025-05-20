"use client";
import DataTable from "@/components/data-table";
import { useStudents } from "@/lib/api/students";
import { StudentBase } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<StudentBase>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    id: "fullname",
    header: "Nom et prénoms",
    cell: ({ row }) =>
      `${row.original.firstname.toUpperCase()} ${row.original.lastname}`,
  },
  {
    id: "birthday",
    header: "Date de naissance",
    cell: ({ row }) => new Date(row.original.dateOfBirth).toDateString(),
  },
];

export default function ManageStudent() {
  const { data: studentsResponse, isLoading, refetch, error } = useStudents();

  const students = studentsResponse?.items || [];
  const total = studentsResponse?.count || 0;

  return (
    <DataTable
      columns={columns}
      data={students}
      isLoading={isLoading}
      error={error?.message || null}
      retryFunction={refetch}
      totalCount={total}
    />
  );
}
