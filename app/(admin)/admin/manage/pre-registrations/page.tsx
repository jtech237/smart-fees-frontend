"use client";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClasses } from "@/lib/api/classes";
import { usePreRegistrations } from "@/lib/api/students";
import { generateAcademicYears, getCurrentAcademicYear } from "@/lib/utils";
import { Registration } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const columns: ColumnDef<Registration>[] = [
  { accessorKey: "id", header: "ID" },
  {
    id: "fullname",
    header: "Nom et prénoms",
    cell: ({ row }) =>
      `${row.original.student.firstname.toUpperCase()} ${
        row.original.student.lastname
      }`,
  },
  {
    accessorKey: "matricule",
    header: "Matricule",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.student.matricule}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const statusLabels = {
        PRE: "Pré-inscrit",
        DOC: "Documents en attente",
        PAY: "Paiement en attente",
        REG: "Inscrit",
      };
      return <span>{statusLabels[row.original.status]}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export default function ManagePreRegistrationPage() {
  const defaultYear = getCurrentAcademicYear();
  const academicYears = generateAcademicYears(5);

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedClass, setSelectedClass] = useState<number | undefined>();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [enableFilter, setEnableFilter] = useState(false);

  const {
    data: registrationsResponse,
    isLoading,
    error,
    refetch,
  } = usePreRegistrations(
    {
      search: debouncedSearch,
      classe: selectedClass,
      academic_year: selectedYear,
      limit: pageSize,
      offset: page * pageSize,
    },
    { staleTime: Infinity }
  );

  const { data: classesResponse, isLoading: isLoadingClasses } = useClasses({
    orphan: true,
  }, {staleTime: Infinity});

  const registrations = registrationsResponse?.items || [];
  const total = registrationsResponse?.count || 0;

  const handlePageChange = useCallback(
    (newPage: number, newPageSize: number) => {
      setPage(newPage);
      setPageSize(newPageSize);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setSelectedYear(defaultYear);
    setSelectedClass(undefined);
    setPage(0);
  }, [defaultYear]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Gestion des pré-inscriptions</h2>
        <Button onClick={() => refetch()} variant="outline">
          Actualiser
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <Button
            onClick={() => setEnableFilter(!enableFilter)}
            variant="ghost"
            className="text-sm"
          >
            {enableFilter ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            {enableFilter && (
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Rechercher par nom ou matricule..."
                className="mb-4"
              />
            )}

            <DataTable
              columns={columns}
              data={registrations}
              isLoading={isLoading}
              error={error?.message}
              retryFunction={refetch}
              totalCount={total}
              enablePagination
              enableSorting
              serverSide
              onPageChange={handlePageChange}
            />
          </div>

          {enableFilter && (
            <div className="w-72 space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filtres</h3>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-destructive"
                >
                  Réinitialiser
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Année académique</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Classe</Label>
                <Select
                  value={selectedClass?.toString() || ""}
                  onValueChange={(value) => setSelectedClass(Number(value))}
                  disabled={isLoadingClasses}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesResponse?.map((classe) => (
                      <SelectItem key={classe.id} value={classe.id.toString()}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
