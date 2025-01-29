"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

import DataTable from '@/components/data-table';
import { fetchData } from '@/lib/api-crud';
import { Classe, ClasseListResponse } from '@/types/classes';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Classe>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nom de la classe" },
  {
    accessorKey: "parent.name",
    id: "parent_name",
    header: "Classe parente",
    cell: ({ row }) => row.original?.parent?.name || "-/-",
  },
];

export default function ClasseListPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const data = await fetchData<ClasseListResponse>("/classes", {
          skip: (pagination.page - 1) * pagination.limit,
          limit: pagination.limit,
        });

        setClasses(data.data);
      } catch (err) {
        console.error("Erreur API :", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, [pagination]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Liste des classes</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/admin" className="font-medium">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Gestion des classes</li>
          </ol>
        </nav>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={classes}
        error={error}
        isLoading={loading}
        enableSorting
        enableFilter
        enablePagination
        searchableColumns={["id", "name"]}
      />
    </div>
  );
}
