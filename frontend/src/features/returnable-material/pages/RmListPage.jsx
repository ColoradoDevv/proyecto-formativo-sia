import { SearchField, RegisterButton, DownloadReportButton } from "@/shared";
import { useState } from "react";
import { Rm } from "../data/returnable-materials";
import { RmColumns } from "../table/RmColumns";
import DataTable from "@/shared/components/DataTable";

export default function RmListPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales Devolutivos
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/devolutivos/crear"
                        onClick={() => {}}
                        className="self-start md:self-auto"
                    >
                        Registrar Material
                    </RegisterButton>
                    <DownloadReportButton
                        onClick={() => {}}
                        className="self-start md:self-auto"
                    >
                        Descargar Reporte
                    </DownloadReportButton>
                    
                
                </div>
            </div>
            <DataTable data={Rm} columns={RmColumns} />
        </div>
    );
}
