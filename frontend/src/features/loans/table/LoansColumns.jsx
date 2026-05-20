import { Switch } from "@/shared";
import LoansRowActions from "../components/LoansRowActions";

export const loansColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "usuario",
        header: "Usuario",
    },
    {
        accessorKey: "material",
        header: "Material",
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
    },
    {
        accessorKey: "fecha_prestamo",
        header: "Fecha Préstamo",
    },
    {
        accessorKey: "fecha_devolucion",
        header: "Fecha Devolución",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const loan = row.original;

            const handleChange = (value) => {
                console.log("Actualizar estado préstamo:", loan.id, value);
            };

            return (
                <Switch
                    checked={loan.is_active}
                    onChange={handleChange}
                    className="inline-flex"
                />
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <LoansRowActions loan={row.original} />,
    },
];
