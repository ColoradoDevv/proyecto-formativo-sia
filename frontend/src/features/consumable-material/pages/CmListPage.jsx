import { SearchField, RegisterButton, DownloadReportButton } from "@/shared";
import { useState } from "react";

export default function ListCmPage() {
// Componente de busqueda

    const [search, setSearch] = useState("");

    const handleSearch = (value) => {
        console.log("Buscar: ", value)
    }

    const handleClear = () => {
        console.log("Campo limpiado")
    }

    return (
        <div className="h-full p-6 text-text-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-h3 font-heading">
                    Listado de Materiales de Consumo
                </h2>

                    <SearchField
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        onClear={handleClear}
                        placeholder="Buscar productos..."
                        size="md"
                        variant="outlined"
                        className="w-75"
                    />

                <div className="grid grid-cols-2 gap-4">
                    <RegisterButton
                        to="/consumibles/crear"
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
