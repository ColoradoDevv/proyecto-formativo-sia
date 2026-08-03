// Hooks y utilidades principales de TanStack Table
import {
  useReactTable, // Hook que crea la instancia de la tabla
  getCoreRowModel, // Modelo base de filas (sin filtros ni paginación)
  flexRender, // Permite renderizar contenido dinámico de columnas
  getPaginationRowModel, // Modelo de filas con paginación
  getFilteredRowModel, // Modelo de filas filtradas
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

// Hook de React para manejar estado
import { useState } from "react";

// Botón reutilizable del sistema de componentes
import { Button, IconButton, Input, SearchField, Select } from "@/shared";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ListFilter } from "lucide-react";

// Componente reutilizable de tabla
// Recibe:
// - data: datos que se mostrarán
// - columns: configuración de columnas
// - onRowDoubleClick: (opcional) callback con la fila original al hacer doble click
// - hiddenColumns: array de column ids que se ocultan en la tabla pero siguen siendo filtrables
export default function DataTable({ data, columns, onRowDoubleClick, hiddenColumns = [] }) {
  // ================== ESTADO DE PAGINACIÓN ==================
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // ================== ESTADO DEL FILTRO GLOBAL ==================
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);

  // Visibilidad de columnas: las de hiddenColumns arrancan ocultas.
  const [columnVisibility, setColumnVisibility] = useState(() =>
    Object.fromEntries(hiddenColumns.map((id) => [id, false]))
  );

  // ================== CONFIGURACIÓN DE LA TABLA ==================
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      columnFilters,
      columnVisibility,
    },

    // Función que se ejecuta cuando cambia la paginación
    onPaginationChange: setPagination,

    // Función que se ejecuta cuando cambia el filtro global
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    // Modelo base de filas
    getCoreRowModel: getCoreRowModel(),

    // Modelo con filtrado aplicado
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // Modelo con paginación aplicada
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanFilter());

  return (
    <div className="space-y-4 mt-4">
      {/* ================== TOOLBAR ================== */}
      {/* Barra superior con buscador y selector de filas */}

      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ================== BUSCADOR ================== */}
        {/* Filtra todas las columnas de la tabla */}
        <SearchField
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={setGlobalFilter}
          variant="outlined"
          fullWidth
          className="sm:w-auto sm:flex-1 sm:max-w-xs"
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {filterableColumns.length > 0 && (
            <IconButton
              ariaLabel={areFiltersVisible ? "Ocultar filtros por columna" : "Mostrar filtros por columna"}
              aria-expanded={areFiltersVisible}
              aria-controls="column-filters"
              title={areFiltersVisible ? "Ocultar filtros" : "Mostrar filtros"}
              variant="ghost"
              isActive={areFiltersVisible || columnFilters.length > 0}
              onClick={() => setAreFiltersVisible((visible) => !visible)}
            >
              <ListFilter size={20} />
            </IconButton>
          )}

          {/* ================== SELECTOR DE FILAS ================== */}
          {/* Permite cambiar cuántas filas se muestran por página */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-border rounded-2xl px-2 py-2 bg-surface-hover shrink-0"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} Filas
              </option>
            ))}
          </select>
        </div>
      </div>

      {filterableColumns.length > 0 && areFiltersVisible && (
        <div id="column-filters" className="rounded-2xl border border-border bg-surface-hover p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-small font-heading text-text-primary">Filtros por columna</p>
            {columnFilters.length > 0 && (
              <Button
                size="sm"
                variant="table"
                onClick={() => table.resetColumnFilters()}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filterableColumns.map((column) => {
              const filterVariant = column.columnDef.meta?.filterVariant ?? "text";
              const label = typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;
              const value = column.getFilterValue() ?? "";

              if (filterVariant === "select") {
                const options = Array.from(column.getFacetedUniqueValues().keys())
                  .filter((option) => option !== null && option !== undefined && option !== "")
                  .sort((a, b) => String(a).localeCompare(String(b), "es"))
                  .map((option) => ({ id: String(option), label: String(option) }));

                return (
                  <Select
                    key={column.id}
                    name={`filter-${column.id}`}
                    label={label}
                    value={value}
                    options={options}
                    placeholder="Todos"
                    onChange={(event) => column.setFilterValue(event.target.value || undefined)}
                    className="w-full min-w-0"
                  />
                );
              }

              return (
                <Input
                  key={column.id}
                  label={label}
                  type={filterVariant === "date" ? "date" : "search"}
                  value={value}
                  onChange={(event) => column.setFilterValue(event.target.value || undefined)}
                  placeholder={filterVariant === "date" ? undefined : `Filtrar ${label.toLowerCase()}...`}
                  className="w-full min-w-0"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ================== TABLA ================== */}
      <div className="overflow-x-auto border-border rounded-2xl">
        <table className="w-full">
          {/* ================== CABECERA ================== */}
          <thead className="bg-surface-muted">
            {/* TanStack agrupa cabeceras automáticamente */}
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-left border-b">
                    {/* 
                      flexRender permite renderizar:
                      - texto
                      - JSX
                      - funciones
                      definidos en columnDef.header
                    */}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ================== CUERPO DE LA TABLA ================== */}
          <tbody>
            {/* Filas generadas por TanStack */}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row.original) : undefined}
                className={`bg-surface-hover hover:bg-background ${onRowDoubleClick ? "cursor-pointer select-none" : ""}`}
              >
                {/* Celdas visibles de cada fila */}
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b border-border mx-auto">
                    {/* Render dinámico del contenido de la celda */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================== FOOTER ================== */}
      <div className="flex items-center justify-center">
        {/* ================== CONTROLES DE PAGINACIÓN ================== */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant="table"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Primera página"
          >
            <ChevronsLeft size={16} />
            Inicio
          </Button>

          <Button
            size="sm"
            variant="table"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
            Anterior
          </Button>

          <span className="text-medium px-2">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          <Button
            size="sm"
            variant="table"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Página siguiente"
          >
            Siguiente
            <ChevronRight size={16} />
          </Button>

          <Button
            size="sm"
            variant="table"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Última página"
          >
            Final
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">

        {/* ================== INFORMACIÓN ================== */}
        {/* Cantidad de registros visibles */}
        <span className="text-medium text-text-secondary">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        {/* ================== IR A PÁGINA ================== */}
        {/* Permite navegar directamente a una página específica */}
        <div className="flex items-center gap-2 text-small ">
          <span>Ir a página:</span>

          <input
            type="number"
            // Página actual (se muestra +1 porque el índice empieza en 0)
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              // Convierte el número ingresado en índice de página
              const page = e.target.value ? Number(e.target.value) - 1 : 0;

              // Cambia la página
              table.setPageIndex(page);
            }}
            className="border rounded-2xl px-2 py-1 w-16 text-center"
          />
        </div>
      </div>
    </div>
  );
}
