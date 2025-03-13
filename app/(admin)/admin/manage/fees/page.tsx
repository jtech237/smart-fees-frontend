"use client";
import DataTable from "@/components/data-table";
import FeeActions from "@/components/fees/FeeActions";
import FeesForm from "@/components/fees/FeesForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useClasses } from "@/lib/api/classes";
import { useFees } from "@/lib/api/fees";
import { generateAcademicYears, getCurrentAcademicYear } from "@/lib/utils";
import { Fee } from "@/types/fees";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const columns: ColumnDef<Fee>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) =>
      Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
      }).format(row.original.amount),
  },
  {
    accessorKey: "academic_year",
    header: "Annee academique",
    cell: ({ row }) => {
      return <p className="text-center">{row.original?.academicYear}</p>;
    },
  },
  { accessorKey: "classe.name", header: "Classe" },
  {
    accessorKey: "dueDate",
    header: "Date d’échéance",
    cell: ({ row }) => {
      return row.original.dueDate ? (
        <p className="text-center">
          {new Date(row.original.dueDate).toLocaleDateString()}
        </p>
      ) : (
        <p className="text-center">-</p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="w-full text-center">Actions</div>,
    cell: ({ row }) => <FeeActions fee={row.original} />,
  },
];

function ManageFeesPage() {
  const defaultYear = getCurrentAcademicYear();
  const [academicYears] = useState<string[]>(() => {
    return generateAcademicYears(5);
  });
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [selectedClass, setSelectedClass] = useState<number | undefined>();

  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const [enableFilter, setEnableFilter] = useState(false);

  const [debounceSearch] = useDebounceValue(searchQuery, 500);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: feesResponse,
    isLoading,
    error,
    refetch: refetchFees,
  } = useFees({
    academic_year: selectedYear,
    search: debounceSearch,
    limit: pageSize,
    offset: pageIndex * pageSize,
    classe: selectedClass,
  });

  const {
    data: classes,
    isLoading: isLoadingClasse,
    error: fetchClasseError,
    refetch: refetchClasses,
  } = useClasses();

  const feesData = feesResponse?.items || [];
  const totalCount = feesResponse?.count || 0;

  const handlePageChange = useCallback((newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  }, []);

  const handleClassChange = useCallback((value: string) => {
    setSelectedClass(parseInt(value));
    setPageIndex(0); // réinitialise la pagination lors du changement de classe
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Gestion des frais</h2>
        <div className="flex gap-4 items-center">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>Ajouter un frais</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un frais</DialogTitle>
              </DialogHeader>
              <FeesForm
                onSuccess={() => {
                  setOpenDialog(false);
                  refetchFees();
                }}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={() => refetchFees()}>Actualiser</Button>
        </div>
      </div>
      <div className="flex gap-3 flex-col">
        <div className="flex justify-center items-center">
          <Button
            variant="outline"
            onClick={() => setEnableFilter(!enableFilter)}
          >
            {enableFilter ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </div>
        <div className="flex flex-row gap-4">
          <div className=" flex-1">
            {enableFilter && (
              <div>
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPageIndex(0); // réinitialise la page à 0 en cas de nouvelle recherche
                  }}
                  placeholder="Rechercher..."
                  className="mb-4"
                />
              </div>
            )}
            {/* Table here */}
            <DataTable
              columns={columns}
              data={feesData}
              isLoading={isLoading}
              error={error?.message || null}
              retryFunction={refetchFees}
              enableSorting
              enablePagination
              serverSide
              totalCount={totalCount}
              onPageChange={handlePageChange}
              searchableColumns={["academicYear", "description"]}
            />
          </div>

          {enableFilter && (
            <div className="w-72 grid grid-cols-1 grid-rows-4 gap-4 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8">
              {/* filters here */}
              <div className="space-y-2">
                <h3>Année scolaire</h3>
                <Select
                  defaultValue={`${selectedYear}`}
                  onValueChange={(value) => {
                    setSelectedYear(value);
                    setPageIndex(0); // réinitialise la pagination lors du changement d'année
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Toutes les années</SelectItem>
                    {(academicYears.length > 0
                      ? academicYears
                      : [defaultYear]
                    ).map((ac) => (
                      <SelectItem key={`acy-${ac}`} value={ac}>
                        {ac}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <h3>Classe</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchClasses()}
                  >
                    Actualiser
                  </Button>
                  {!isLoadingClasse && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClass(undefined)}
                    >
                      Effacer
                    </Button>
                  )}
                </div>
                {isLoadingClasse ? (
                  <Skeleton className="h-7.5 w-full" />
                ) : fetchClasseError ? (
                  <p className="text-destructive-foreground">
                    {fetchClasseError.message}{" "}
                    <Link href="#" onClick={() => refetchClasses()}>
                      Ressayer
                    </Link>
                  </p>
                ) : (
                  <Select
                    defaultValue={selectedClass ? `${selectedClass}` : ""}
                    onValueChange={handleClassChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Toutes les classes</SelectItem>
                      {classes?.map((classe) => (
                        <SelectItem key={classe.id} value={`${classe.id}`}>
                          {classe.name}
                        </SelectItem>
                      ))}
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

export default ManageFeesPage;
