import { useParams } from "react-router-dom";
import { FileText, ImageOff } from "lucide-react";
import useRm from "../../hooks/useRm";
import { TailChase } from "ldrs/react";
import { CloudAlert } from "lucide-react";

function DetailCard({ title, children }) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-[var(--radius-2xl)] border border-border bg-surface-hover">
            <h3 className="text-small font-heading border-b border-border pb-2">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    );
}

function DetailField({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? "sm:col-span-2" : ""}>
            <p className="text-caption text-text-primary uppercase tracking-wide">{label}</p>
            <p className="text-text-secondary text-small mt-1">
                {value ?? <span className="italic text-text-muted">No registrado</span>}
            </p>
        </div>
    );
}

export default function RmDetailView() {
    const { id } = useParams();
    const { RM: material, loading, error } = useRm(id);

    const formatCurrency = (value) =>
        value != null ? `$${Number(value).toLocaleString("es-CO")}` : null;

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

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-h3">Visualizar Material Devolutivo</h2>
                <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
            </div>

            <div className="flex gap-6 items-start">
                {/* Columna izquierda: foto + ficha técnica */}
                <div className="flex flex-col gap-4 w-[var(--size-field-sm)] shrink-0">
                    <div className="flex flex-col gap-3 p-4 rounded-[var(--radius-2xl)] border border-border bg-surface-hover">
                        <p className="text-caption text-text-primary uppercase tracking-wide font-heading">Foto del Producto</p>
                        <div className="w-full aspect-square rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                            {material.image
                                ? <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center gap-2 text-text-muted">
                                    <ImageOff size={40} />
                                    <span className="text-caption">Sin foto</span>
                                </div>
                            }
                        </div>
                        <span className={`w-fit px-3 py-0.5 rounded-[var(--radius-full)] text-caption font-medium ${material.is_active ? "bg-success-soft text-success" : "bg-error-soft text-error"}`}>
                            {material.is_active ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 p-4 rounded-[var(--radius-2xl)] border border-border bg-surface-hover">
                        <p className="text-caption text-text-primary uppercase tracking-wide font-heading">Ficha Técnica</p>
                        {material.technical_sheet
                            ? <a
                                href={material.technical_sheet}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-brand text-small hover:underline"
                            >
                                <FileText size={16} />
                                Ver ficha técnica
                            </a>
                            : <span className="text-small italic text-text-muted">No registrada</span>
                        }
                    </div>
                </div>

                {/* Columna derecha: cards con campos */}
                <div className="flex flex-col gap-4 flex-1">
                    <DetailCard title="Información General">
                        <DetailField label="Nombre" value={material.name} />
                        <DetailField label="Placa SENA" value={material.sena_plate} />
                        <DetailField label="Serial" value={material.serial} />
                        <DetailField label="Categoría" value={material.category?.name} />
                        <DetailField label="Descripción" value={material.description} fullWidth />
                    </DetailCard>

                    <DetailCard title="Inventario">
                        <DetailField label="Marca" value={material.brand?.name} />
                        <DetailField label="Estado" value={material.state} />
                        <DetailField label="Cantidad" value={material.quantity} />
                        <DetailField label="Ubicación" value={material.location} />
                    </DetailCard>

                    <DetailCard title="Valores y Fechas">
                        <DetailField label="Valor Unitario" value={formatCurrency(material.unit_price)} />
                        <DetailField label="Valor Total" value={formatCurrency(material.total_price)} />
                        <DetailField label="Fecha de Compra" value={material.purchase_date} />
                    </DetailCard>

                    <DetailCard title="Responsable">
                        <DetailField
                            label="Usuario"
                            value={material.user ? `${material.user.first_name} ${material.user.last_name}` : null}
                        />
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}
