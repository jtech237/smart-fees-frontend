"use client";
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
import { useClassrooms } from "@/lib/api/classrooms";
import { useStudents } from "@/lib/api/students";
import { generateAcademicYears, getCurrentAcademicYear } from "@/lib/utils";
import { StudentBase } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

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
    accessorKey: "matricule",
    header: "Matricule",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.matricule}</span>
    ),
  },
  {
    id: "birthday",
    header: "Date de naissance",
    cell: ({ row }) => new Date(row.original.dateOfBirth).toDateString(),
  },
];

export default function ManageStudent() {
  const defaultYear = getCurrentAcademicYear();
  const academicYears = generateAcademicYears(5);

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedClass, setSelectedClass] = useState<number | undefined>();
  const [selectedClassroom, setSelectedClassroom] = useState<
    number | undefined
  >();

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounceValue(search, 500);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [enableFilter, setEnableFilter] = useState(false);

  const {
    data: studentsResponse,
    isLoading,
    refetch,
    error,
  } = useStudents(
    {
      academic_year: selectedYear,
      search: debounceSearch,
      limit: pageSize,
      offset: page * pageSize,
      classe: selectedClass,
    },
    { staleTime: Infinity }
  );
  const {
    data: classesResponse,
    isLoading: isLoadingClasse,
    refetch: refetchClasses,
    error: fetchClasseError,
  } = useClasses({ orphan: true });
  const {
    data: classroomsResponse,
    isLoading: isLoadingClassrooms,
    refetch: refetchClassrooms,
    error: fetchClassroomsError,
  } = useClassrooms(
    {
      classe: selectedClass,
    },
    {
      enabled: !!selectedClass,
      staleTime: Infinity,
    }
  );

  const students = studentsResponse?.items || [];
  const total = studentsResponse?.count || 0;

  const handlePageChange = useCallback(
    (newPageIndex: number, newPageSize: number) => {
      setPage(newPageIndex);
      setPageSize(newPageSize);
    },
    []
  );

  const handleClassChange = useCallback((newClassId: number) => {
    setSelectedClass(newClassId);
    setPage(0); // réinitialise la page à 0 en cas de nouvelle recherche
  }, []);

  const handleClassroomChange = useCallback((newClassroomId: number) => {
    setSelectedClassroom(newClassroomId);
    setPage(0); // réinitialise la page à 0 en cas de nouvelle recherche
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedYear(defaultYear);
    setSelectedClass(undefined);
    setSelectedClassroom(undefined);
    setPage(0);
  }, [defaultYear]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2>Gestion des eleves</h2>
        <div className="flex gap-4 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Ajouter un élève</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un élève</DialogTitle>
              </DialogHeader>
              <DialogDescription asChild>
                <div className="grid gap-4">
                  {/* Add your form component here */}
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <Button onClick={() => refetch()}>Actualiser</Button>
        </div>
      </div>

      <div className="flex gap-3 flex-col">
        <div className="flex justify-center items-center">
          <Button onClick={() => setEnableFilter(!enableFilter)}>
            {" "}
            {enableFilter ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            {enableFilter && (
              <div>
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0); // réinitialise la page à 0 en cas de nouvelle recherche
                  }}
                  placeholder="Rechercher..."
                  className="mb-4"
                />
              </div>
            )}

            <DataTable
              columns={columns}
              data={students}
              isLoading={isLoading}
              error={error?.message || null}
              retryFunction={refetch}
              totalCount={total}
              enablePagination
              enableSorting
              serverSide
              searchableColumns={["firstname", "lastname"]}
              onPageChange={handlePageChange}
            />
          </div>

          {enableFilter && (
            <div className="w-72 space-y-4 p-4 bg-card rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filtres</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-destructive hover:text-destructive/80"
                >
                  Réinitialiser
                </Button>
              </div>

              {/* Annee academique */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Annee academique</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
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

              {/* Selection de classe */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Classe</Label>
                {fetchClasseError ? (
                  <div className="space-y-2 text-destructive">
                    <p className="text-sm">Erreur de chargement des classes</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchClasses()}
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={selectedClass?.toString() || ""}
                    onValueChange={(value) => handleClassChange(Number(value))}
                    disabled={isLoadingClasse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClasse ? (
                        <SelectItem value="loading" disabled>
                          Chargement...
                        </SelectItem>
                      ) : (
                        classesResponse?.map((classe) => (
                          <SelectItem
                            key={classe.id}
                            value={classe.id.toString()}
                          >
                            {classe.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Sélection de salle */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Salle de classe</label>
                {fetchClassroomsError ? (
                  <div className="space-y-2 text-destructive">
                    <p className="text-sm">Erreur de chargement des salles</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchClassrooms()}
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={selectedClassroom?.toString() || ""}
                    onValueChange={(value) =>
                      handleClassroomChange(Number(value))
                    }
                    disabled={!selectedClass || isLoadingClassrooms}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedClass
                            ? "Choisissez d'abord une classe"
                            : "Sélectionnez une salle"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClassrooms ? (
                        <SelectItem value="loading" disabled>
                          Chargement...
                        </SelectItem>
                      ) : classroomsResponse?.length ? (
                        classroomsResponse.map((classroom) => (
                          <SelectItem
                            key={classroom.id}
                            value={classroom.id.toString()}
                          >
                            {classroom.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Aucune salle disponible
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
