import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useDebounceValue } from "usehooks-ts";
import { Skeleton } from "./ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  error?: string | null;
  retryFunction?: () => void;
  enableSorting?: boolean;
  pageSizes?: number[];
  enablePagination?: boolean;
  searchableColumns?: (keyof TData)[];
  enableFilter?: boolean;
}

const DataTable = <TData extends object, TValue>({
  columns,
  data,
  isLoading = true,
  emptyMessage = "Aucune donnee disponible!",
  error,
  retryFunction,
  enableSorting = false,
  pageSizes = [5, 10, 25, 50, 100],
  enablePagination = false,
  searchableColumns,
  enableFilter = false,
}: DataTableProps<TData, TValue>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [debounceSearchQuery] = useDebounceValue(searchQuery, 3000)

  const filteredData = useMemo(() => {
    if (!enableFilter || !debounceSearchQuery.trim()) return data;

    return data.filter((row) =>
      searchableColumns?.some((key) =>
        String(row[key])?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [enableFilter, debounceSearchQuery, data, searchableColumns, searchQuery]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    state: enablePagination ? { pagination } : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
  });

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>{error}</p>
        {retryFunction && <Button onClick={retryFunction}>Réessayer</Button>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {enableFilter && (
        <Input
          type="search"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher..."
          value={searchQuery}
          className="mb-4"
        />
      )}
      {/* Tableau */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={
                    enableSorting
                      ? header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                      : undefined
                  }
                  onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
                  className={cn(
                    enableSorting && header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                  )}
                  tabIndex={enableSorting ? 0 : -1}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {enableSorting &&
                      (header.column.getIsSorted() === "asc"
                        ? "▲"
                        : header.column.getIsSorted() === "desc"
                          ? "▼"
                          : null)}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Squelette de chargement
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7.5 w-full" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ) : filteredData.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-4 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between py-4">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Précédent
          </Button>
          <span>
            Page {table.getState().pagination?.pageIndex + 1} sur {table.getPageCount()}
          </span>
          <Select onValueChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e) }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lignes par page" />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size} lignes par page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable
