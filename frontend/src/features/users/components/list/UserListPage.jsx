import DataTable from "@/shared/components/DataTable";
import { userColumns } from "../../table/UserColumns.jsx";
import { users } from "../../data/users/users.js";
import { RegisterButton } from "../../../../shared/index.js";
import { DownloadReportButton } from "../../../../shared/index.js";

export default function ListUserPage() {
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
                        onClick={() => {}}
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
