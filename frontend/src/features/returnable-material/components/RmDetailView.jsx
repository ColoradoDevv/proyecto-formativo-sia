import { useParams } from "react-router-dom";
import { Rm } from "../data/returnable-materials";
import { FileText, ImageOff } from "lucide-react";

function DetailCard({ title, children }) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface-hover">
            <h3 className="text-sm font-semibold border-b border-border pb-2">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    );
}

function DetailField({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? "sm:col-span-2" : ""}>
            <p className="text-xs text-text-primary uppercase tracking-wide">{label}</p>
            <p className="text-text-secondary text-sm mt-1">
                {value ?? <span className="italic text-text-muted">No registrado</span>}
            </p>
        </div>
    );
}

export default function RmDetailView() {
    const { id } = useParams();
    const material = Rm.find((m) => String(m.id) === String(id)) ?? Rm[0];

    const formatCurrency = (value) =>
        value != null ? `$${Number(value).toLocaleString("es-CO")}` : null;

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-h3">Visualizar Material Devolutivo</h2>
                <p className="text-sm text-text-muted">Información completa en modo solo lectura.</p>
            </div>

            <div className="flex gap-6 items-start">
                {/* Columna izquierda: foto + ficha técnica */}
                <div className="flex flex-col gap-4 w-64 shrink-0">
                    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface-hover">
                        <p className="text-xs text-text-primary uppercase tracking-wide font-semibold">Foto del Producto</p>
                        <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                            {material.rm_photo
                                ? <img src={material.rm_photo} alt={material.rm_name} className="w-full h-full object-cover" />
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
                        {material.rm_technical_sheet
                            ? <a
                                href={
                                    typeof material.rm_technical_sheet === "string"
                                        ? material.rm_technical_sheet
                                        : URL.createObjectURL(material.rm_technical_sheet)
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
                        <DetailField label="Nombre" value={material.rm_name} />
                        <DetailField label="Placa SENA" value={material.rm_sena_plate} />
                        <DetailField label="Serial" value={material.rm_serial} />
                        <DetailField label="Categoría" value={material.rm_category} />
                    </DetailCard>

                    <DetailCard title="Inventario">
                        <DetailField label="Marca" value={material.rm_brand} />
                        <DetailField label="Estado del material" value={material.rm_state} />
                        <DetailField label="Cantidad" value={material.rm_quantity} />
                    </DetailCard>

                    <DetailCard title="Valores">
                        <DetailField label="Valor Unitario" value={formatCurrency(material.rm_unit_value)} />
                        <DetailField label="Valor Total" value={formatCurrency(material.rm_total_value)} />
                    </DetailCard>
                </div>
            </div>
        </div>
    );
}
