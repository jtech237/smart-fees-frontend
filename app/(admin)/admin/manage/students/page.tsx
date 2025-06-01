"use client"
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

export default function ManageStudentPage() {
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

  // Filter panel visibility
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
    setPage(0); // reset page on filter change
    if(isNaN(newClassId)){
      setSelectedClass(undefined)
      return
    }
    setSelectedClass(newClassId);
  }, []);

  const handleClassroomChange = useCallback((newClassroomId: number) => {
    setPage(0);
    if(isNaN(newClassroomId)){
      setSelectedClass(undefined)
      return
    }
    setSelectedClassroom(newClassroomId);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedYear(defaultYear);
    setSelectedClass(undefined);
    setSelectedClassroom(undefined);
    setPage(0);
    setSearch("");
  }, [defaultYear]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with title and refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Élèves</h1>
        <div>
          <Button onClick={() => refetch()}>Actualiser</Button>
        </div>
      </div>

      {/* Filters Toggle */}
      <div>
        <Button onClick={() => setEnableFilter(!enableFilter)}>
          {enableFilter ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>
      </div>

      {/* Filters Section */}
      {enableFilter && (
        <div className="shadow rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Filtres</h2>
            <Button
              variant="link"
              size="sm"
              onClick={handleResetFilters}
              className="text-destructive"
            >
              Réinitialiser
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="flex flex-col space-y-1">
              <Label>Recherche</Label>
              <Input
                type="search"
                placeholder="Nom, Prénom ou Matricule"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>

            {/* Année académique */}
            <div className="flex flex-col space-y-1">
              <Label>Année académique</Label>
              <Select
                value={selectedYear}
                onValueChange={(val) => {
                  setSelectedYear(val);
                  setPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
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

            {/* Classe */}
            <div className="flex flex-col space-y-1">
              <Label>Classe</Label>
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
                  value={selectedClass?.toString() || "null"}
                  onValueChange={(value) => handleClassChange(Number(value))}
                  disabled={isLoadingClasse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Toutes</SelectItem>
                    {classesResponse?.map((classe) => (
                      <SelectItem key={classe.id} value={classe.id.toString()}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Salle de classe */}
            <div className="flex flex-col space-y-1">
              <Label>Salle de classe</Label>
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
                  value={selectedClassroom?.toString() || "null"}
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
                    <SelectItem value="null">Toutes</SelectItem>
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
        </div>
      )}

      {/* DataTable Section */}
      <div className="shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Liste des Élèves</h2>
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

      {/* Add Student Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Ajouter un élève</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un élève</DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="grid gap-4">{/* Form component placeholder */}</div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
