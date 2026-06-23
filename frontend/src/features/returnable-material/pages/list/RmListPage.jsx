import { Link } from "react-router-dom"
import { useState } from "react";
import { RegisterButton, DownloadReportButton } from "@/shared";
import { RmColumns } from "../../table/RmColumns";
import DataTable from "@/shared/components/DataTable";
import { returnablesReportConfig } from "../../reports/returnablesReportConfig.js";
import useRMs from "../../hooks/useRMs";
import { TailChase } from "ldrs/react";
import { CloudAlert, Plus, Download } from "lucide-react";
import Alert from "@mui/material/Alert";
import { Button } from "@/shared"

export default function RmListPage() {
    const { RMs, setRMs, loading, error } = useRMs();
    const [notification, setNotification] = useState(null);

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
                        <p className="font-heading">Error al cargar Materiales Devolutivos</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales Devolutivos
                </h2>
                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/devolutivos/crear">
                        <Button
                            className="self-start md:self-auto"
                            variant="soft"
                            icon={Plus}
                        >
                            Registrar Material
                        </Button>
                         </Link>
                        <Button
                            data={RMs}
                            reportConfig={returnablesReportConfig}
                            className="self-start md:self-auto"
                            icon={Download}
                        >
                            Descargar Reporte
                        </Button>
                </div>
            </div>
            
            <DataTable data={RMs} columns={RmColumns(setRMs, setNotification)} />
        </div>
    );
}
