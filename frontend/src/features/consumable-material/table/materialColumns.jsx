import { ActiveSwitch } from "@/shared";
import { toggleCmActive } from "../services/consumableService";
import UserRowActions from "../components/list/UserRowActions";

export const materialColumns = [
    {
        accessorFn: (row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : "Sin cuentadante",
        id: "user",
        header: "Cuentadante",
    },
    {
        accessorKey: "name",
        header: "Nombre del material",
    },
    {
        accessorKey: "quantity",
        header: "Cantidad",
    },
    {
        accessorKey: "state",
        header: "Disponibilidad",
    },
    {
        accessorKey: "location",
        header: "Ubicación",
    },
    {
        accessorKey: "purchase_date",
        header: "Fecha de compra",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => (
            <ActiveSwitch
                id={row.original.id}
                isActive={row.original.is_active}
                toggleFn={toggleCmActive}
            />
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <UserRowActions user={row.original} />,
    },
];