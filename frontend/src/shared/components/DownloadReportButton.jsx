import { Download } from "lucide-react";
import Button from "./Button";

export default function DownloadReportButton({
    children = "Descargar Reporte",
    className = "",
    ...props
}) {
    return (
        <Button
            variant="primary"
            icon={Download}
            className={`shadow-[var(--shadow-elevation-1)] ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
}
