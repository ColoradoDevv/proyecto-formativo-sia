import { RegisterButton, DownloadReportButton } from "@/shared";
import { Rm } from "../data/returnable-materials";
import { RmColumns } from "../table/RmColumns";
import DataTable from "@/shared/components/DataTable";
import { returnablesReportConfig } from "../reports/returnablesReportConfig.js";

export default function RmListPage() {
    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales Devolutivos
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/devolutivos/crear"
                        className="self-start md:self-auto"
                    >
                        Registrar Material
                    </RegisterButton>
                    <DownloadReportButton
                        data={Rm}
                        reportConfig={returnablesReportConfig}
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
