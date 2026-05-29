import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton } from "@/shared";
import DetailCard from "./DetailCard";
import DetailField from "./DetailField";
import useCm from "../../hooks/useCm";
import { TailChase } from 'ldrs/react';
import 'ldrs/react/TailChase.css';
import { Undo2, ImageOff } from "lucide-react";

export default function CmDetailView() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { CM, loading, error } = useCm(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="black"/>
            </div>
        );

    if (error) return <p>Error al cargar material: {error.message}</p>;

    const formatCurrency = (value) =>
        value != null ? `$${Number(value).toLocaleString("es-CO")}` : "-";

    return (
    <div className="h-full p-6 text-text-primary flex flex-col gap-6">

        {/* Encabezado */}
        <div className="flex items-center gap-3">
            <IconButton onClick={() => navigate(-1)} variant="ghost">
                <Undo2/>
            </IconButton>
            <div>
                <h2 className="text-h3">Visualizar Material de Consumo</h2>
                <p className="text-sm text-text-muted">Información completa en modo solo lectura.</p>
            </div>
        </div>

        <div className="flex flex-col gap-6">

            {/* Card General con foto integrada */}
            <DetailCard title="Información General" cols={3}>
                <div className="flex flex-col gap-4">
                    <DetailField label="Nombre"     value={CM.name} />
                    <DetailField label="Placa SENA" value={CM.sena_plate ?? "Sin placa"} />
                </div>
                <div className="flex flex-col gap-4">
                    <DetailField label="Marca"       value={CM.brand?.name ?? "Sin marca"} />
                    <DetailField label="Cuentadante" value={CM.user ? `${CM.user.first_name} ${CM.user.last_name}` : "Sin cuentadante"} />
                </div>

                {/* Foto — ocupa col 3, fila 1 y 2 */}
                <div className="row-span-2 flex items-center justify-center">
                    <div className="w-40 aspect-square rounded-xl overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                        {CM.image
                            ? <img src={CM.image} alt={CM.name} className="w-40 h-40 object-cover" />
                            : <div className="flex flex-col items-center gap-2 text-text-muted">
                                <ImageOff size={20} />
                                <span className="text-xs">Sin foto</span>
                            </div>
                        }
                    </div>
                </div>

                {/* Descripción — ocupa cols 1 y 2 en fila 2 */}
                <div className="col-span-2">
                    <DetailField label="Descripción" value={CM.description} fullWidth />
                </div>
            </DetailCard>

            {/* Inventario y Valores lado a lado */}
            <div className="grid grid-cols-2 gap-6">
                <DetailCard title="Inventario" cols={2}>
                    <DetailField label="Cantidad"        value={CM.quantity ?? "Sin cantidad"} />
                    <DetailField label="Ubicación"       value={CM.location ?? "Sin ubicación"} />
                    <DetailField label="Estado"          value={CM.state} />
                    <DetailField label="Fecha de compra" value={CM.purchase_date} />
                    <DetailField label="Activo"          value={CM.is_active ? "Activo" : "Inactivo"} />
                </DetailCard>

                <DetailCard title="Valores" cols={2}>
                    <DetailField label="Valor Unitario" value={formatCurrency(CM.unit_price)} />
                    <DetailField label="Valor Total"    value={formatCurrency(CM.total_price)} />
                </DetailCard>
            </div>
        </div>

        <div className="flex gap-4 justify-end">
            <Button variant="secondary" size="md" onClick={() => navigate("/consumibles")}>
                Volver al listado
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate(`/consumibles/editar/${CM.id}`)}>
                Editar
            </Button>
        </div>

    </div>
);
}