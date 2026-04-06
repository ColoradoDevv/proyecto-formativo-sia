import SearchBar from "../../../shared/components/SearchBar";
import { RegisterButton } from "../../../shared";
import { DownloadReportButton } from "../../../shared";

export default function ListCmPage() {
    const materialFilters = [
        { value: "todos", label: "Todos" },
        { value: "nombre", label: "Nombre" },
        { value: "categoria", label: "Categoria" },
    ];

    return (
        <div className="h-full p-6 text-[#0C2D48]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-bold">
                    Listado de Materiales de Consumo
                </h2>

                <SearchBar
                    placeholder="Buscar material..."
                    onSearch={() => {}}
                    filterOptions={materialFilters}
                    onFilterChange={() => {}}
                    className="md:max-w-md"
                />

                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
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
        </div>
    );
}
