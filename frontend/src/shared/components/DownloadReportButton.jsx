import { Download } from "lucide-react";

export default function DownloadReportButton({
    children = "Descargar Reporte",
    className = "",
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            className={`
                inline-flex h-11 items-center gap-2 rounded-md
                bg-[#173B5C] px-5 text-[14px] font-semibold text-white
                shadow-sm transition-colors duration-200
                hover:bg-[#12324E]
                focus:outline-none focus:ring-2 focus:ring-[#9BB5CB] focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-60
                ${className}
            `.trim()}
            {...props}
        >
            <Download size={18} strokeWidth={2.3} aria-hidden="true" />
            <span>{children}</span>
        </button>
    );
}
