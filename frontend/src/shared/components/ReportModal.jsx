import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, TableProperties } from "lucide-react";
import { buildReportDataset } from "@/shared/reports/buildReportDataset";
import { generateExcelReport } from "@/shared/reports/generateExcelReport";
import { generatePdfReport } from "@/shared/reports/generatePdfReport";

const FORMAT_OPTIONS = [
    { value: "pdf",   label: "PDF",   Icon: FileText },
    { value: "excel", label: "Excel", Icon: TableProperties },
];

export default function ReportModal({
    isOpen,
    onClose,
    data = [],
    fields = [],
    reportTitle = "Reporte",
    fileNamePrefix = "reporte",
}) {
    const [format, setFormat] = useState("pdf");
    const [selectedFields, setSelectedFields] = useState([]);
    const [scope, setScope] = useState("all");
    const [filterValue, setFilterValue] = useState("");

    // Reset state every time the modal opens
    useEffect(() => {
        if (isOpen) {
            setFormat("pdf");
            setSelectedFields(fields.filter((f) => f.default));
            setScope("all");
            setFilterValue("");
        }
    }, [isOpen, fields]);

    if (!isOpen) return null;

    const handleToggleField = (field) => {
        const exists = selectedFields.find((f) => f.key === field.key);
        setSelectedFields(
            exists
                ? selectedFields.filter((f) => f.key !== field.key)
                : [...selectedFields, field]
        );
    };

    const handleGenerate = () => {
        if (selectedFields.length === 0) return;

        const { headers, rows } = buildReportDataset({
            data,
            selectedFields,
            scope,
            filterValue,
        });

        if (rows.length === 0) {
            alert("No hay registros que coincidan con el filtro aplicado.");
            return;
        }

        const date = new Date().toISOString().slice(0, 10);
        const ext = format === "excel" ? "xlsx" : "pdf";
        const fileName = `${fileNamePrefix}-${date}.${ext}`;

        if (format === "excel") {
            generateExcelReport({ headers, rows, reportTitle, fileName });
        } else {
            generatePdfReport({ headers, rows, reportTitle, fileName });
        }

        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-500/20 backdrop-blur-xs"
                onClick={onClose}
            />

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-lg bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] p-8 flex flex-col gap-6">

                {/* Header */}
                <div>
                    <h2 className="text-h3 font-heading text-text-primary">Generar Reporte</h2>
                    <p className="text-small text-text-secondary mt-0.5">{reportTitle}</p>
                </div>

                <div className="w-full h-px bg-white/40" />

                {/* Format selector */}
                <div>
                    <p className="text-small font-semibold text-text-primary mb-3">
                        Formato de exportación
                    </p>
                    <div className="flex gap-3">
                        {FORMAT_OPTIONS.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFormat(value)}
                                className={`flex-1 inline-flex items-center justify-center gap-2 h-[var(--size-control-md)] rounded-[var(--radius-full)] text-small font-medium border transition-colors duration-[var(--duration-base)] cursor-pointer
                                    ${format === value
                                        ? "bg-brand border-brand text-text-inverse"
                                        : "bg-white/40 border-border text-text-primary hover:bg-white/60"
                                    }`}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Field selection */}
                <div>
                    <p className="text-small font-semibold text-text-primary mb-3">
                        Campos a incluir{" "}
                        <span className="font-body text-text-secondary">
                            ({selectedFields.length} de {fields.length})
                        </span>
                    </p>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                        {fields.map((field) => {
                            const checked = selectedFields.some((f) => f.key === field.key);
                            return (
                                <label
                                    key={field.key}
                                    className="flex items-center gap-2 text-small text-text-primary cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleField(field)}
                                        className="w-4 h-4 rounded accent-brand"
                                    />
                                    {field.label}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Scope filter */}
                <div>
                    <p className="text-small font-semibold text-text-primary mb-3">Registros</p>
                    <div className="flex gap-3 mb-3">
                        {[
                            { value: "all",    label: "Todos" },
                            { value: "filter", label: "Filtrar" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setScope(value)}
                                className={`flex-1 h-[var(--size-control-sm)] rounded-[var(--radius-full)] text-small font-medium border transition-colors duration-[var(--duration-base)] cursor-pointer
                                    ${scope === value
                                        ? "bg-brand border-brand text-text-inverse"
                                        : "bg-white/40 border-border text-text-primary hover:bg-white/60"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {scope === "filter" && (
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="Texto a buscar en los registros…"
                            className="w-full h-[var(--size-control-md)] rounded-[var(--radius-full)] border border-border bg-white/40 px-4 text-small text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
                        />
                    )}
                </div>

                <div className="w-full h-px bg-white/40" />

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 cursor-pointer h-[var(--size-control-md)] rounded-[var(--radius-full)] border border-border bg-white/40 text-text-primary text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={selectedFields.length === 0}
                        className="flex-1 cursor-pointer h-[var(--size-control-md)] rounded-[var(--radius-full)] bg-brand border border-brand text-text-inverse text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generar reporte
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
