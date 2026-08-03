import { ActiveSwitch } from "@/shared";
import UserRowActions from "@/features/users/components/list/UserRowActions"; // ajusta la ruta segun tu estructura real
import UserActiveSwitch  from "../components/list/UserActiveSwitch"; 


export const getUserColumns = (onDeleted) => [
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
        meta: { filterVariant: "select" },
    },
    {
        accessorFn: (row) => row.document_type?.name ?? "Sin tipo de documento",
        id: "document_type",
        header: "Tipo de Documento",
        meta: { filterVariant: "select" },
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
        accessorFn: (row) => row.is_active ? "Activo" : "Inactivo",
        id: "is_active",
        header: "Estado",
        meta: { filterVariant: "select" },
        cell: ({ row }) => <UserActiveSwitch user={row.original} />,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
            <UserRowActions user={row.original} onDeleted={onDeleted} />
        ),
    },
];
