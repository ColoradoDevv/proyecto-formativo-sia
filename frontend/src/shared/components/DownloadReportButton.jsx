import { Download } from "lucide-react";
import { useState } from "react";
import ReportModal from "./ReportModal";

export default function DownloadReportButton({
    children = "Descargar Reporte",
    className = "",
    type = "button",
    data,
    reportConfig,
    ...props
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (reportConfig && data) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <button
                type={type}
                onClick={handleClick}
                className={`
                    inline-flex h-10 items-center gap-2 rounded-full
                    bg-brand px-6 text-medium font-medium text-text-inverse
                    shadow-sm transition-colors duration-200
                    hover:bg-brand-hover
                    focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-60
                    ${className}
                `.trim()}
                {...props}
            >
                <Download size={18} strokeWidth={2.3} aria-hidden="true" />
                <span>{children}</span>
            </button>

            {reportConfig && data && (
                <ReportModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={data}
                    fields={reportConfig.fields}
                    reportTitle={reportConfig.reportTitle}
                    fileNamePrefix={reportConfig.fileNamePrefix}
                />
            )}
        </>
    );
}
