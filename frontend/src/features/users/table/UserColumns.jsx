import { ActiveSwitch } from "@/shared";
import { toggleUserActive } from "../services/userService";
import UserRowActions from "../components/list/UserRowActions";

export const userColumns = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "nombre",
        header: "Nombre",
    },
    {
        accessorFn: (row) => row.groups && row.groups.length > 0
            ? row.groups.map(g => g.name).join(", ")
            : "Sin grupo",
        id: "groups",
        header: "Grupo",
    },
    {
        accessorFn: (row) => row.document_type?.name ?? "Sin tipo de documento",
        id: "document_type",
        header: "Tipo de Documento",
    },
    {
        accessorKey: "document_number",
        header: "Numero de Documento",
    },
    {
        accessorKey: "email",
        header: "Correo",
    },
    {
        accessorKey: "phone_number",
        header: "Teléfono",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => (
            <ActiveSwitch
                id={row.original.id}
                isActive={row.original.is_active}
                toggleFn={toggleUserActive}
                entity="usuario"
            />
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <UserRowActions user={row.original} />,
    },
];