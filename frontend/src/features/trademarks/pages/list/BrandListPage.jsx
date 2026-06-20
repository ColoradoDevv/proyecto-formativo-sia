import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SearchField, IconButton, ActiveSwitch } from '@/shared';
import { Funnel, Plus, ArrowLeft, ArrowRight, Pencil, CloudAlert } from 'lucide-react';
import { TailChase } from 'ldrs/react';
import Alert from '@mui/material/Alert';
import useBrands from '../../hooks/useBrands';
import { toggleBrandActive } from '../../services/brandService';

export default function BrandListPage() {
    const { brands, setBrands, loading, error } = useBrands();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState(null);
    const itemsPerPage = 8;

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error)
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-3 bg-text-secondary border border-text-secondary text-text-inverse rounded-lg px-6 py-4 max-w-md">
                    <CloudAlert />
                    <div>
                        <p className="font-heading">Error al cargar Marcas</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const startIdx = currentPage * itemsPerPage;
    const paginatedBrands = filteredBrands.slice(startIdx, startIdx + itemsPerPage);

    const handlePrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
    const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

    const handleToggle = async (id, newValue) => {
        try {
            await toggleBrandActive(id, newValue);
            setBrands((prev) =>
                prev.map((b) => (b.id === id ? { ...b, is_active: newValue } : b))
            );
        } catch {
            setNotification({ severity: 'error', message: 'Error al cambiar el estado de la marca' });
        }
    };

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">

            {/* Encabezado */}
            <div className="flex flex-col gap-4">
                <h2 className="text-h3 font-heading">Marcas</h2>

                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}

                <div className="flex gap-4 items-center">
                    <SearchField
                        placeholder="Buscar marca..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={setSearchTerm}
                        className="flex-1"
                    />
                    <Button variant="secondary" className="flex gap-2">
                        <Funnel size={18} />
                        Filtrar
                    </Button>
                    <Link to="/marcas/crear">
                        <Button className="flex gap-2">
                            <Plus size={18} />
                            Registrar Marca
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Grid */}
            {paginatedBrands.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedBrands.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-surface-hover rounded-[var(--radius-2xl)] p-4 border border-border flex flex-col gap-3 hover:shadow-[var(--shadow-elevation-2)] transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-small font-heading flex-1">{brand.name}</h3>
                                <div className="flex gap-2 items-center">
                                    <Link to={`/marcas/editar/${brand.id}`}>
                                        <IconButton variant="ghost" hitSize={32} iconSize={16}>
                                            <Pencil size={16} />
                                        </IconButton>
                                    </Link>
                                    <ActiveSwitch
                                        id={brand.id}
                                        isActive={brand.is_active}
                                        toggleFn={handleToggle}
                                    />
                                </div>
                            </div>

                            <Link
                                to={`/marcas/visualizar/${brand.id}`}
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
                    <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 0}>
                        <ArrowLeft size={18} />
                        Anterior
                    </Button>
                    <span className="text-small text-text-muted">
                        Página {currentPage + 1} de {totalPages}
                    </span>
                    <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                        Siguiente
                        <ArrowRight size={18} />
                    </Button>
                </div>
            )}
        </div>
    );
}
