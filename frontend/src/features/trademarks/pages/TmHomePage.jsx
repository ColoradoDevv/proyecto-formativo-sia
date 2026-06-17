import { useNavigate } from "react-router-dom";
import { Button, SearchField } from '@/shared';
import DetailCard from '../components/detail/DetailCard';
import { Funnel, Plus, ArrowLeft, ArrowRight } from "lucide-react";

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SearchField, IconButton } from '@/shared';
import { Funnel, Plus, ArrowLeft, ArrowRight, Pencil, X } from "lucide-react";
import useBrands from '../hooks/useBrands';
import { TailChase } from 'ldrs/react';
import { CloudAlert } from 'lucide-react';

export default function TmHomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-full p-6 text-text-primary flex flex-col gap-6">
      {/* Encabezado y controles */}
      <div className="flex flex-col gap-4">
        <h2 className="text-h3 font-heading">Marcas</h2>

        <div className="flex gap-4 items-center">
          <SearchField
            placeholder="Buscar marca..."
            variant="outlined"
            
          />          
          <div className="space-x-2 justify-self-end">
            <Button
              // to="/devolutivos/crear"
              className="self-start md:self-auto"
            >
              Filtrar
              {/* <Funnerl/> */}
              <Funnel size={18}/>
            </Button>
            <Button
              // data={Rm}
              // reportConfig={returnablesReportConfig}
              className="self-start md:self-auto"
            >
              Registrar Marca
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de marcas */}
      {paginatedBrands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-surface-hover rounded-[var(--radius-2xl)] p-4 border border-border flex flex-col gap-3 hover:shadow-[var(--shadow-elevation-2)] transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-small font-heading text-text-primary flex-1">
                  {brand.name}
                </h3>
                <div className="flex gap-2">
                  <Link to={`/marcas/editar/${brand.id}`}>
                    <IconButton variant="ghost" hitSize={32} iconSize={16}>
                      <Pencil size={16} />
                    </IconButton>
                  </Link>
                  <IconButton variant="ghost" hitSize={32} iconSize={16}>
                    <X size={16} />
                  </IconButton>
                </div>
              </div>

              <span className={`w-fit px-3 py-0.5 rounded-[var(--radius-full)] text-caption font-medium ${
                brand.is_active ? "bg-success-soft text-success" : "bg-error-soft text-error"
              }`}>
                {brand.is_active ? "Activo" : "Inactivo"}
              </span>

              <Link
                to={`/marcas/${brand.id}`}
                className="text-brand text-small hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted">No se encontraron marcas</p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <ArrowLeft size={18} />
            Anterior
          </Button>

          <span className="text-small text-text-muted">
            Página {currentPage + 1} de {totalPages}
          </span>

          <Button
            variant="secondary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Siguiente
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
