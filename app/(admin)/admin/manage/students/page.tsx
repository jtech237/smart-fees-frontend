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

  const { data: studentsResponse, isLoading, refetch, error } = useStudents();
  const {
    data: classesResponse,
    isLoading: isLoadingClasse,
    refetch: refetchClasses,
    error: fetchClasseError,
  } = useClasses();
  const {
    data: classroomsResponse,
    isLoading: isLoadingClassrooms,
    refetch: refetchClassrooms,
    error: fetchClassroomsError,
  } = useClassrooms({}, {});

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
            <div>
              <div className="mb-4">
                <label htmlFor="academic-year">Année académique</label>
                <select
                  id="academic-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="class">Classe</label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => handleClassChange(Number(e.target.value))}
                >
                  {classesResponse?.map((classe) => (
                    <option key={classe.id} value={classe.id}>
                      {classe.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="classroom">Salle de classe</label>
                <select
                  id="classroom"
                  value={selectedClassroom}
                  onChange={(e) =>
                    handleClassroomChange(Number(e.target.value))
                  }
                >
                  {classroomsResponse?.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
