import { useState } from "react";
import { RegisterButton, DownloadReportButton } from "@/shared";
import DataTable from "@/shared/components/DataTable";
import { loansColumns } from "../../table/LoansColumns";
import { loansReportConfig } from "../../reports/loansReportConfig.js";
import useLoans from "../../hooks/useLoans";
import { TailChase } from "ldrs/react";
import { CloudAlert, Plus, Download } from "lucide-react";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { Button } from "@/shared"



export default function LoansListPage() {
    const { loans, loading, error } = useLoans();
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
                        <p className="font-heading">Error al cargar Préstamos</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Préstamos
                </h2>
                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/prestamos/crear">
                        <Button
                            className="self-start md:self-auto"
                            variant="soft"
                            icon={Plus}
                        >
                            Registrar Préstamo
                        </Button>
                    </Link>

                    <Button
                        data={loans}
                        reportConfig={loansReportConfig}
                        className="self-start md:self-auto"
                        icon={Download}
                    >
                        Descargar Reporte
                    </Button>
                </div>
            </div>

            <DataTable data={loans} columns={loansColumns} />
        </div>
    );
}
