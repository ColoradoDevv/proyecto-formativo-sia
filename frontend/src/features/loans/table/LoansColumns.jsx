import { StatusBadge } from "@/shared";
import LoansRowActions from "../components/list/LoansRowActions";

export const loansColumns = [
    {
        accessorKey: "id_loan",
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
        accessorKey: "amount_lent",
        header: "Cantidad",
    },
    {
        accessorKey: "loan_date",
        header: "Fecha Préstamo",
    },
    {
        accessorKey: "return_date",
        header: "Fecha Devolución",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => (
            <StatusBadge
                active={row.original.is_active}
                activeLabel="Prestado"
                inactiveLabel="Devuelto"
            />
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <LoansRowActions loan={row.original} />,
    },
];
