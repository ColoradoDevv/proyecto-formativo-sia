import { useNavigate, useParams } from "react-router-dom";
import { Undo2, FileText, ImageOff } from "lucide-react";
import { Button, IconButton, Input, StatusBadge, EditCard } from "@/shared";
import useRm from "../../hooks/useRm";
import { TailChase } from "ldrs/react";
import { CloudAlert } from "lucide-react";

export default function RmDetailView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { RM: material, loading, error } = useRm(id);

    const formatCurrency = (value) =>
        value != null ? `$${Number(value).toLocaleString("es-CO")}` : "-";

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
                    <span className="text-h1"><CloudAlert /></span>
                    <div>
                        <p className="font-heading">Error al cargar el material</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    if (!material) return null;

    // Valores de solo lectura (los selects de Editar se muestran como texto).
    const categoryLabel = material.category?.name ?? "Sin categoría";
    const brandLabel = material.brand?.name ?? "Sin marca";
    const userLabel = material.user
        ? `${material.user.first_name} ${material.user.last_name}`
        : "Sin responsable";

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Visualizar Material Devolutivo</h2>
                </div>
            </div>

            <div className="flex flex-col gap-3">

                {/* Información General — foto lateral + campos */}
                <EditCard title="Información General" cols={1}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* Foto + estado + ficha técnica */}
                        <div className="flex flex-col items-center gap-2 shrink-0 w-full sm:w-32">
                            <div className="size-24 rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                                {material.image
                                    ? <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
                                    : <ImageOff size={40} className="text-text-muted" />
                                }
                            </div>
                            <StatusBadge active={material.is_active} />
                            {material.technical_sheet
                                ? <a
                                    href={material.technical_sheet}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-brand text-caption hover:underline"
                                >
                                    <FileText size={14} />
                                    Ficha técnica
                                </a>
                                : <span className="text-caption italic text-text-muted">Sin ficha</span>
                            }
                        </div>

                        {/* Campos generales */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                            <Input label="Nombre" value={material.name ?? ""} disabled readOnly />
                            <Input label="Placa SENA" value={material.sena_plate ?? ""} disabled readOnly />
                            <Input label="Serial" value={material.serial ?? ""} disabled readOnly />
                            <Input label="Categoría" value={categoryLabel} disabled readOnly />
                            <Input label="Marca" value={brandLabel} disabled readOnly />
                            <Input label="Responsable" value={userLabel} disabled readOnly />
                            <div className="sm:col-span-2">
                                <Input label="Descripción" value={material.description ?? ""} disabled readOnly />
                            </div>
                        </div>

                    </div>
                </EditCard>

                {/* Inventario y Valores lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <EditCard title="Inventario">
                        <Input label="Estado" value={material.state ?? ""} disabled readOnly />
                        <Input label="Cantidad" value={material.quantity ?? "Sin cantidad"} disabled readOnly />
                        <Input label="Ubicación" value={material.location ?? "Sin ubicación"} disabled readOnly />
                        <Input label="Fecha de compra" value={material.purchase_date ?? ""} disabled readOnly />
                    </EditCard>

                    <EditCard title="Valores">
                        <Input label="Valor Unitario" value={formatCurrency(material.unit_price)} disabled readOnly />
                        <Input label="Valor Total" value={formatCurrency(material.total_price)} disabled readOnly />
                    </EditCard>
                </div>

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button variant="secondary" size="md" onClick={() => navigate("/devolutivos")}>
                        Volver al listado
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate(`/devolutivos/editar/${material.id}`)}>
                        Editar
                    </Button>
                </div>

            </div>

        </div>
    );
}
