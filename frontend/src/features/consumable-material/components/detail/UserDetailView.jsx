import { useParams } from "react-router-dom";
import { materials } from "../../data/materials/materials";
import DetailCard from "./DetailCard";
import DetailField from "./DetailField";
import { FileText, ImageOff } from "lucide-react";

export default function CmDetailView() {
    const { id } = useParams();
    const material = materials.find((m) => String(m.id) === String(id)) ?? materials[0];

    const formatCurrency = (value) =>
        value != null ? `$${Number(value).toLocaleString("es-CO")}` : null;

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-h3">Visualizar Material de Consumo</h2>
                <p className="text-sm text-text-muted">Información completa en modo solo lectura.</p>
            </div>

            <div className="flex gap-6 items-start">
                {/* Columna izquierda: foto + ficha técnica */}
                <div className="flex flex-col gap-4 w-64 shrink-0">
                    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface-hover">
                        <p className="text-xs text-text-primary uppercase tracking-wide font-semibold">Foto del Producto</p>
                        <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                            {material.cm_photo
                                ? <img src={material.cm_photo} alt={material.cm_name} className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center gap-2 text-text-muted">
                                    <ImageOff size={40} />
                                    <span className="text-xs">Sin foto</span>
                                </div>
                            }
                        </div>
                        <span className={`w-fit px-3 py-0.5 rounded-full text-xs font-medium ${material.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {material.is_active ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface-hover">
                        <p className="text-xs text-text-primary uppercase tracking-wide font-semibold">Ficha Técnica</p>
                        {material.cm_technical_sheet
                            ? <a
                                href={
                                    typeof material.cm_technical_sheet === "string"
                                        ? material.cm_technical_sheet
                                        : URL.createObjectURL(material.cm_technical_sheet)
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-brand text-sm hover:underline"
                            >
                                <FileText size={16} />
                                Ver ficha técnica
                            </a>
                            : <span className="text-sm italic text-text-muted">No registrada</span>
                        }
                    </div>
                </div>

                {/* Columna derecha: cards con campos */}
                <div className="flex flex-col gap-4 flex-1">
                    <DetailCard title="Información General">
                        <DetailField label="Nombre" value={material.cm_name} />
                        <DetailField label="Placa SENA" value={material.cm_sena_plate} />
                        <DetailField label="Descripción" value={material.cm_description} fullWidth />
                    </DetailCard>

                    <DetailCard title="Inventario">
                        <DetailField label="Cantidad" value={material.cm_quantity} />
                        <DetailField label="Ubicación" value={material.cm_location} />
                        <DetailField label="Marca" value={material.cm_brand} />
                        <DetailField label="Estado del material" value={material.cm_state} />
                    </DetailCard>

                    <DetailCard title="Valores">
                        <DetailField label="Valor Unitario" value={formatCurrency(material.cm_unit_value)} />
                        <DetailField label="Valor Total" value={formatCurrency(material.cm_total_value)} />
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}
