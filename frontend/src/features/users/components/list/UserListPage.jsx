import DataTable from "@/shared/components/DataTable";
import { userColumns } from "../../table/UserColumns.jsx";
import { RegisterButton, DownloadReportButton } from "../../../../shared/index.js";
import { usersReportConfig } from "../../reports/usersReportConfig.js";
import useUsers from "../../hooks/useUsers.js";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { CloudAlert } from "lucide-react";

export default function ListUserPage() {

    // FETCH GET /api/users/
    const { users, loading, error } = useUsers();

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)"/>
            </div>
        )

    if (error) return (
        <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-3 bg-text-secondary  border border-text-secondary text-text-inverse rounded-lg px-6 py-4 max-w-md">
                <span className="text-h1"><CloudAlert/></span>
                <div>
                    <p className="font-heading">Error al cargar Usuarios</p>
                    <p className="text-small">{error.message}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3">
                    Listado de Usuarios
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/usuarios/crear"
                        className="self-start md:self-auto"
                    >
                        Registrar Usuario
                    </RegisterButton>
                    <DownloadReportButton
                        data={users}
                        reportConfig={usersReportConfig}
                        className="self-start md:self-auto"
                    >
                        Descargar Reporte
                    </DownloadReportButton>
                </div>
            </div>

            <DataTable data={users} columns={userColumns} />
        </div>
    );
}
