import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type Column,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Tag,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue = unknown> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue = unknown>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center gap-1.5 font-semibold hover:text-gray-900 transition-colors cursor-pointer select-none"
    >
      <span>{title}</span>
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="w-4 h-4 text-blue-600 shrink-0" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="w-4 h-4 text-blue-600 shrink-0" />
      ) : (
        <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0 opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  defaultPageSize?: number;
  maxHeightClass?: string;
  stickyHeader?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  emptyMessage = "Tidak ada data yang ditemukan",
  defaultPageSize = 5,
  maxHeightClass,
  stickyHeader = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase().trim();
      if (!search) return true;

      // 1. Cek nilai kolom standar dari TanStack Table
      const colValue = row.getValue(columnId);
      if (colValue !== undefined && colValue !== null && String(colValue).toLowerCase().includes(search)) {
        return true;
      }

      // 2. Cek ke dalam seluruh properti string/number dari row.original
      const item: any = row.original;
      if (!item) return false;

      const searchInObj = (obj: any, depth = 0): boolean => {
        if (!obj || typeof obj !== "object" || depth > 3) return false;
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (val === null || val === undefined) continue;
          if (typeof val === "string" || typeof val === "number") {
            if (String(val).toLowerCase().includes(search)) return true;
          } else if (typeof val === "object") {
            if (searchInObj(val, depth + 1)) return true;
          }
        }
        return false;
      };

      return searchInObj(item);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar & Filter Pencarian */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Menampilkan <span className="font-semibold text-gray-900">{table.getFilteredRowModel().rows.length}</span> dari <span className="font-semibold text-gray-900">{data.length}</span> data
        </div>
      </div>

      {/* Tabel Utama */}
      <div className={`overflow-auto relative ${maxHeightClass || ""}`}>
        <table className="w-full text-left text-sm">
          <thead className={`bg-gray-50 border-b border-gray-200 text-gray-600 ${stickyHeader ? "sticky top-0 z-10 shadow-xs" : ""}`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-3.5 px-4 font-semibold tracking-tight ${(header.column.columnDef.meta as any)?.headerClassName || ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`py-3 px-4 text-gray-700 ${(cell.column.columnDef.meta as any)?.cellClassName || ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="w-8 h-8 text-gray-300" />
                    <p className="font-medium">{emptyMessage}</p>
                    {globalFilter && (
                      <button
                        type="button"
                        onClick={() => setGlobalFilter("")}
                        className="text-xs text-blue-600 hover:underline mt-1"
                      >
                        Reset pencarian
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Navigasi Pagiasi (Pagination) */}
      <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="ml-2">
            Halaman <span className="font-semibold text-gray-900">{table.getState().pagination.pageIndex + 1}</span> dari{" "}
            <span className="font-semibold text-gray-900">{table.getPageCount()}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
