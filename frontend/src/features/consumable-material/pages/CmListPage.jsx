import { RegisterButton, DownloadReportButton } from "@/shared";
import DataTable from "@/shared/components/DataTable";
import { materialColumns } from "../table/materialColumns.jsx";
import { consumablesReportConfig } from "../reports/consumablesReportConfig.js";
import useProducts from "../hooks/useCMs.js";
import { TailChase } from 'ldrs/react'
import { CloudAlert } from "lucide-react";
import Alert from "@mui/material/Alert";
import { useState } from "react";



export default function ListCmPage() {

    // FETCH GET /api/users/
    const { CMs, loading, error } = useProducts();
    const [notification, setNotification] = useState(null);
    

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="black"/>
            </div>
        )

    if (error) return (
        <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-3 bg-text-secondary  border border-text-secondary text-text-inverse rounded-lg px-6 py-4 max-w-md">
                <span className="text-2xl"><CloudAlert/></span>
                <div>
                    <p className="font-semibold">Error al cargar Materiales de Consumo</p>
                    <p className="text-sm">{error.message}</p>
                </div>
            </div>
        </div>
    )


    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales de Consumo
                </h2>
                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/consumibles/crear"
                        className="self-start md:self-auto"
                    >
                        Registrar Material
                    </RegisterButton>
                    <DownloadReportButton
                        data={CMs}
                        reportConfig={consumablesReportConfig}
                        className="self-start md:self-auto"
                    >
                        Descargar Reporte
                    </DownloadReportButton>
                </div>
            </div>
            <DataTable data={CMs} columns={materialColumns} />
        </div>
    );
}
