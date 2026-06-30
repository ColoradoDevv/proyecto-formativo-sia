import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, EditCard } from "@/shared";
import { Undo2 } from "lucide-react";
import { TailChase } from "ldrs/react";
import useBrand from "../../hooks/useBrand";

export default function BrandDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { brand, loading, error } = useBrand(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error)
        return <p className="text-error text-center p-6">Error al cargar marca: {error.message}</p>;

    if (!brand)
        return <p className="text-center p-6">Marca no encontrada</p>;

    return (
        <div className="h-full p-4 sm:p-6 text-text-primary flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Visualizar Marca</h2>
                    <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
                </div>
            </div>

            <EditCard title="Información General" cols={2}>
                <Input label="ID" value={brand.id ?? ""} disabled readOnly />
                <Input label="Nombre" value={brand.name ?? ""} disabled readOnly />
            </EditCard>

            <div className="flex gap-4 justify-center md:justify-end">
                <Button variant="secondary" size="md" onClick={() => navigate("/marcas")}>
                    Volver al listado
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate(`/marcas/editar/${brand.id}`)}>
                    Editar
                </Button>
            </div>
        </div>
    );
}
