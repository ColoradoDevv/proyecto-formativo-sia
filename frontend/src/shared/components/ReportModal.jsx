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
            <div className="relative z-10 w-full max-w-lg bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl p-8 flex flex-col gap-6">

                {/* Header */}
                <div>
                    <h2 className="text-lg font-bold text-[#0C2D48]">Generar Reporte</h2>
                    <p className="text-sm text-[#526B7B] mt-0.5">{reportTitle}</p>
                </div>

                <div className="w-full h-px bg-white/40" />

                {/* Format selector */}
                <div>
                    <p className="text-sm font-semibold text-[#0C2D48] mb-3">
                        Formato de exportación
                    </p>
                    <div className="flex gap-3">
                        {FORMAT_OPTIONS.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFormat(value)}
                                className={`flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium border transition-colors duration-200 cursor-pointer
                                    ${format === value
                                        ? "bg-[#203F57] border-[#203F57] text-white"
                                        : "bg-white/40 border-[#CAD5D3] text-[#0C2D48] hover:bg-white/60"
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
                    <p className="text-sm font-semibold text-[#0C2D48] mb-3">
                        Campos a incluir{" "}
                        <span className="font-normal text-[#526B7B]">
                            ({selectedFields.length} de {fields.length})
                        </span>
                    </p>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                        {fields.map((field) => {
                            const checked = selectedFields.some((f) => f.key === field.key);
                            return (
                                <label
                                    key={field.key}
                                    className="flex items-center gap-2 text-sm text-[#0C2D48] cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleToggleField(field)}
                                        className="w-4 h-4 rounded accent-[#203F57]"
                                    />
                                    {field.label}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Scope filter */}
                <div>
                    <p className="text-sm font-semibold text-[#0C2D48] mb-3">Registros</p>
                    <div className="flex gap-3 mb-3">
                        {[
                            { value: "all",    label: "Todos" },
                            { value: "filter", label: "Filtrar" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setScope(value)}
                                className={`flex-1 h-9 rounded-full text-sm font-medium border transition-colors duration-200 cursor-pointer
                                    ${scope === value
                                        ? "bg-[#203F57] border-[#203F57] text-white"
                                        : "bg-white/40 border-[#CAD5D3] text-[#0C2D48] hover:bg-white/60"
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
                            className="w-full h-10 rounded-full border border-[#CAD5D3] bg-white/40 px-4 text-sm text-[#0C2D48] placeholder-[#AFBCBF] focus:outline-none focus:ring-2 focus:ring-[#AFBCBF]"
                        />
                    )}
                </div>

                <div className="w-full h-px bg-white/40" />

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 cursor-pointer h-10 rounded-full border border-[#CAD5D3] bg-white/40 text-[#0C2D48] text-sm font-medium transition-colors duration-200 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#AFBCBF]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={selectedFields.length === 0}
                        className="flex-1 cursor-pointer h-10 rounded-full bg-[#203F57] border border-[#203F57] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#0C2D48] focus:outline-none focus:ring-2 focus:ring-[#AFBCBF] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generar reporte
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
