import LoansRowActions from "../components/list/LoansRowActions";
import LoanStateBadge from "../components/LoanStateBadge";

// Factory: recibe onReturn para que la fila pueda abrir el modal de devolución.
export const loansColumns = ({ onReturn } = {}) => [
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
        accessorKey: "state",
        header: "Estado",
        cell: ({ row }) => <LoanStateBadge state={row.original.state} />,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <LoansRowActions loan={row.original} onReturn={onReturn} />,
    },
];
