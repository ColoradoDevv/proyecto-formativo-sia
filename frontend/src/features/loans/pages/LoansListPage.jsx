import { RegisterButton, DownloadReportButton } from "@/shared";
import DataTable from "@/shared/components/DataTable";
import { loansColumns } from "../table/LoansColumns";
import { loans } from "../data/loans/loans";
import { loansReportConfig } from "../reports/loansReportConfig.js";

export default function LoansListPage() {
    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Préstamos
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/prestamos/crear"
                        className="self-start md:self-auto"
                    >
                        Registrar Préstamo
                    </RegisterButton>
                    <DownloadReportButton
                        data={loans}
                        reportConfig={loansReportConfig}
                        className="self-start md:self-auto"
                    >
                        Descargar Reporte
                    </DownloadReportButton>
                </div>
            </div>

            <DataTable data={loans} columns={loansColumns} />
        </div>
    );
}
