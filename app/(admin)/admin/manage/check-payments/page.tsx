"use client";

import { Button } from "@/components/ui/button";
import { useClasses } from "@/lib/api/classes";
import { Payment, usePayments, usePaymentStats } from "@/lib/api/payment";
import { generateAcademicYears, getCurrentAcademicYear } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DataTable from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPaymentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);

  const [selectedClass, setSelectedClass] = useState<number | undefined>();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    getCurrentAcademicYear()
  );
  const [statusFilter, setStatusFilter] = useState<string>(""); // "" => tous
  const [transactionSearch, setTransactionSearch] = useState("");

  const [dateFrom, setDateFrom] = useState<string>(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState<string>(""); // YYYY-MM-DD

  const [enableFilters, setEnableFilters] = useState(true);

  // Pagination du tableau
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // -------------------- 2. Récupération des données --------------------
  // 2.1. Statistiques globales
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = usePaymentStats({
    staleTime: Infinity,
  });

  // 2.2. Liste des paiements filtrés (pour le tableau)
  const {
    data: paymentsResponse,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = usePayments(
    {
      search: debouncedSearch,
      classe: selectedClass,
      academic_year: selectedAcademicYear,
      transaction_id: transactionSearch,
      status: statusFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      limit: pageSize,
      offset: pageIndex * pageSize,
    },
    { staleTime: Infinity }
  );

  // 2.3. Liste des classes pour le sélecteur
  const {
    data: classesData,
    isLoading: classesLoading,
    error: classesError,
  } = useClasses({ orphan: true }, { staleTime: Infinity });

  // 2.4. Liste des années académiques pour le sélecteur
  const academicYears = useMemo(() => generateAcademicYears(5), []);

  // Données pour le tableau et le total
  const payments: Payment[] = paymentsResponse?.items || [];
  const totalCount: number = paymentsResponse?.count || 0;

  // -------------------- 3. Traitement des données pour les graphiques --------------------
  // 3.1. Graphique « Répartition des paiements par statut (Pie) »
  //    Nous allons transformer statsData.by_status en un tableau adapté à Recharts.
  const pieData = useMemo(() => {
    console.log(statsData)
    if (!statsData || !statsData.byStatus) return [];
    console.log(statsData)
    return Object.entries(statsData.byStatus).map(([statusKey, stat]) => {
      let label = "";
      if (statusKey === "PEN") label = "En attente";
      if (statusKey === "COM") label = "Complétés";
      if (statusKey === "FAI") label = "Échoués";
      return {
        name: label,
        value: stat.count,
      };
    });
  }, [statsData]);

  // 3.2. Graphique « Time Series journalière (BarChart ou LineChart) »
  //    On prend statsData.time_series tel quel, en adaptant le format si besoin.
  const timeSeries = statsData?.timeSeries || [];

  // Couleurs pour le PieChart (3 statuts)
  const pieColors = ["#4F46E5", "#10B981", "#F59E0B"];
  // (^ vous pouvez choisir n'importe quelles couleurs, ici c’est indicative)

  // -------------------- 4. Colonnes du DataTable --------------------
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID Paiement",
      },
      {
        id: "studentName",
        header: "Élève",
        cell: ({ row }) => {
          const s = row.original.student;
          return `${(s.firstname || "").toUpperCase()} ${s.lastname || ""}`;
        },
      },
      {
        accessorKey: "student.matricule",
        header: "Matricule",
        cell: ({ row }) => (
          <span className="font-mono">{row.original.student.matricule}</span>
        ),
      },
      {
        id: "classe",
        header: "Classe",
        cell: ({ row }) => row.original.classe?.name || "—",
      },
      {
        accessorKey: "academic_year",
        header: "Année Académique",
      },
      {
        accessorKey: "fees_type",
        header: "Type de frais",
      },
      {
        accessorKey: "amount",
        header: "Montant (FCFA)",
        cell: ({ row }) =>
          `${row.original.amount.toLocaleString("fr-FR")} FCFA`,
      },
      {
        accessorKey: "method",
        header: "Méthode",
      },
      {
        accessorKey: "transaction_id",
        header: "N°Transaction",
        cell: ({ row }) => row.original.transactionId || "—",
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
          const code = row.original.status;
          const mapLabel: Record<string, string> = {
            pen: "En attente",
            com: "Complété",
            fai: "Échoué",
          };
          const label = mapLabel[code] || code;

          // Badge coloré selon le statut
          const colorClass = {
            pen: "bg-yellow-100 text-yellow-800",
            com: "bg-green-100 text-green-800",
            fai: "bg-red-100 text-red-800",
          }[code as "pen" | "com" | "fai"];

          return (
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${colorClass}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date Création",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("fr-FR"),
      },
    ],
    []
  );

  // -------------------- 5. Handlers (Pagination, Reset filtres) --------------------
  const handlePageChange = useCallback(
    (newPage: number, newPageSize: number) => {
      setPageIndex(newPage);
      setPageSize(newPageSize);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setSelectedClass(undefined);
    setSelectedAcademicYear(getCurrentAcademicYear());
    setStatusFilter("");
    setTransactionSearch("");
    setDateFrom("");
    setDateTo("");
    setPageIndex(0);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/*** 6.1. Titre + Boutons rafraîchissement ***/}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de Bord des Paiements</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              refetchStats();
              refetchPayments();
            }}
            variant="outline"
          >
            Actualiser le dashboard
          </Button>
        </div>
      </div>
      {/*** 6.2. Section « Aperçu Global » (Stats + Graphiques) ***/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6.2.1. Cartes de statistiques par statut */}
        <div className="col-span-1 shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Répartition par statut</h2>
          {statsLoading ? (
            <p>Chargement...</p>
          ) : statsData ? (
            <div className="grid grid-cols-1 gap-4">
              {["com", "pen", "fai"].map((statKey) => {
                const label =
                  statKey === "com"
                    ? "Paiements complétés"
                    : statKey === "pen"
                    ? "Paiements en attente"
                    : "Paiements échoués";
                const stat = statsData?.byStatus?.[statKey as "pen" | "com" | "fai"];
                const colorBar =
                  statKey === "com"
                    ? "bg-green-500"
                    : statKey === "pen"
                    ? "bg-yellow-500"
                    : "bg-red-500";
                return (
                  <div
                    key={statKey}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="text-2xl font-bold">{stat?.count || 0}</p>
                    </div>
                    <div className="h-6 w-6 rounded-full overflow-hidden">
                      <div className={`${colorBar} h-full w-full`} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Impossible de charger les statistiques.</p>
          )}
        </div>

        {/* 6.2.2. Graphe Camembert (PieChart) */}
        <div className="bg-card">
          <h2>Proportion par statut (Nbr de paiements)</h2>
          {statsLoading ? (
            <p>Chargement graphique...</p>
          ) : (
            <ResponsiveContainer width={"100%"} height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey={"value"}
                  nameKey={"name"}
                  cx={"50%"}
                  cy={"50%"}
                //   innerRadius={50}
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={pieColors[idx % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} paiements`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 6.2.3. Série temporelle (BarChart) */}
        <div className="col-span-1 bg-card shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            Évolution journalière (30 derniers jours)
          </h2>
          {statsLoading ? (
            <p>Chargement graphique...</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickFormatter={(d) => d.slice(5)} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value} FCFA`} />
                <Legend/>
                <Bar
                  dataKey="totalAmount"
                  fill="#4F46E5"
                  name="Montant (FCFA)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/*** 6.3. Section « Filtres Avancés » ***/}
      <div className="shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Filtres Avancés</h2>
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
          {/* Recherche libre : nom, prénom, matricule */}
          <div className="flex flex-col space-y-1">
            <Label>Recherche élève</Label>
            <Input
              type="search"
              placeholder="Nom, Prénom ou Matricule"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          {/* Sélecteur de classe */}
          <div className="flex flex-col space-y-1">
            <Label>Classe</Label>
            <Select
              value={selectedClass?.toString() || ""}
              onValueChange={(val) => {
                if(val === "null") {
                    setSelectedClass(undefined)
                    setPageIndex(0);
                    return
                }
                setSelectedClass(val ? Number(val) : undefined);
                setPageIndex(0);
              }}
              disabled={classesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Toutes</SelectItem>
                {classesData?.map((cl) => (
                  <SelectItem key={cl.id} value={cl.id.toString()}>
                    {cl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélecteur d'année académique */}
          <div className="flex flex-col space-y-1">
            <Label>Année académique</Label>
            <Select
              value={selectedAcademicYear}
              onValueChange={(val) => {
                setSelectedAcademicYear(val);
                setPageIndex(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((ay) => (
                  <SelectItem key={ay} value={ay}>
                    {ay}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélecteur de statut */}
          <div className="flex flex-col space-y-1">
            <Label>Statut</Label>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setPageIndex(0);
                if(val === "null"){
                    setStatusFilter("")
                    return
                }
                setStatusFilter(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Tous</SelectItem>
                <SelectItem value="PEN">En attente</SelectItem>
                <SelectItem value="COM">Complété</SelectItem>
                <SelectItem value="FAI">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recherche par transaction ID */}
          <div className="flex flex-col space-y-1">
            <Label>N° de transaction</Label>
            <Input
              type="text"
              placeholder="Ex : TXN-2025-..."
              value={transactionSearch}
              onChange={(e) => {
                setTransactionSearch(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          {/* Filtre date de début */}
          <div className="flex flex-col space-y-1">
            <Label>Date de création (De)</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          {/* Filtre date de fin */}
          <div className="flex flex-col space-y-1">
            <Label>Date de création (À)</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>
        </div>
      </div>

      {/*** 6.4. Section « Tableau détaillé » ***/}
      <div className="shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Liste des paiements des étudiants
        </h2>
        <DataTable
          columns={columns}
          data={payments}
          isLoading={paymentsLoading}
          error={paymentsError?.message}
          retryFunction={refetchPayments}
          totalCount={totalCount}
          enablePagination
          serverSide
          onPageChange={handlePageChange}
          enableSorting={false} // (vous pouvez ajouter, voir note)
        />
      </div>
    </div>
  );
}
