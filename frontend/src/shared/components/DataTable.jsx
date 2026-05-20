// Hooks y utilidades principales de TanStack Table
import {
  useReactTable, // Hook que crea la instancia de la tabla
  getCoreRowModel, // Modelo base de filas (sin filtros ni paginación)
  flexRender, // Permite renderizar contenido dinámico de columnas
  getPaginationRowModel, // Modelo de filas con paginación
  getFilteredRowModel, // Modelo de filas filtradas
} from "@tanstack/react-table";

// Hook de React para manejar estado
import { useState } from "react";

// Botón reutilizable del sistema de componentes
import { Button, SearchField } from "@/shared";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

// Componente reutilizable de tabla
// Recibe:
// - data: datos que se mostrarán
// - columns: configuración de columnas
export default function DataTable({ data, columns }) {
  // ================== ESTADO DE PAGINACIÓN ==================
  // pageIndex → página actual
  // pageSize → cantidad de filas por página
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // ================== ESTADO DEL FILTRO GLOBAL ==================
  // Se usa para el buscador de la tabla
  const [globalFilter, setGlobalFilter] = useState("");

  // ================== CONFIGURACIÓN DE LA TABLA ==================
  const table = useReactTable({
    // Datos que se mostrarán
    data,

    // Definición de columnas
    columns,

    // Estado controlado de la tabla
    state: {
      globalFilter,
      pagination,
    },

    // Función que se ejecuta cuando cambia la paginación
    onPaginationChange: setPagination,

    // Función que se ejecuta cuando cambia el filtro global
    onGlobalFilterChange: setGlobalFilter,

    // Modelo base de filas
    getCoreRowModel: getCoreRowModel(),

    // Modelo con filtrado aplicado
    getFilteredRowModel: getFilteredRowModel(),

    // Modelo con paginación aplicada
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 mt-4">
      {/* ================== TOOLBAR ================== */}
      {/* Barra superior con buscador y selector de filas */}

      <div className="flex items-center justify-between gap-4">
        {/* ================== BUSCADOR ================== */}
        {/* Filtra todas las columnas de la tabla */}
        <SearchField
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={setGlobalFilter}
          variant="outlined"
        />

        {/* ================== SELECTOR DE FILAS ================== */}
        {/* Permite cambiar cuántas filas se muestran por página */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-2"
        >
          {[5, 10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size} Filas
            </option>
          ))}
        </select>
      </div>

      {/* ================== TABLA ================== */}
      <div className="overflow-x-auto border rounded">
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
              <tr key={row.id} className="bg-surface-hover hover:bg-surface-muted">
                {/* Celdas visibles de cada fila */}
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b">
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
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2 text-sm">
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
            className="border rounded px-2 py-1 w-16"
          />
        </div>
      </div>
    </div>
  );
}
