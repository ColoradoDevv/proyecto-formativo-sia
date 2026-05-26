import { RegisterButton, DownloadReportButton } from "@/shared";
import DataTable from "@/shared/components/DataTable";
import { materialColumns } from "../table/materialColumns.jsx";
import { materials } from "../data/materials/materials.js";
import { consumablesReportConfig } from "../reports/consumablesReportConfig.js";

export default function ListCmPage() {
    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales de Consumo
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/consumibles/crear"
                        className="self-start md:self-auto"
                    >
                        Registrar Material
                    </RegisterButton>
                    <DownloadReportButton
                        data={materials}
                        reportConfig={consumablesReportConfig}
                        className="self-start md:self-auto"
                    >
                        Descargar Reporte
                    </DownloadReportButton>
                </div>
            </div>
            <DataTable data={materials} columns={materialColumns} />
        </div>
    );
}
