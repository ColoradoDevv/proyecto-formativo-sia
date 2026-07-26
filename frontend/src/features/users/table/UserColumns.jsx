import { ActiveSwitch, promptAlert } from "@/shared";
import { toggleUserActive } from "@/features/users/services/userService"; // ajusta la ruta segun tu estructura real
import UserRowActions from "@/features/users/components/list/UserRowActions"; // ajusta la ruta segun tu estructura real

function UserActiveSwitch({ user }) {
    const isAdmin = user.groups?.some(
        (group) => String(group.name).trim().toUpperCase() === "ADMIN"
    );

    const requestDeactivationReason = async (nextIsActive) => {
        if (nextIsActive || !isAdmin) return undefined;

        const result = await promptAlert({
            icon: "warning",
            iconColor: "var(--color-warning)",
            title: "Justificación requerida",
            text: "Indique el motivo para deshabilitar esta cuenta de Administrador.",
            inputLabel: "Justificación",
            inputPlaceholder: "Describa el motivo de la deshabilitación",
            confirmText: "Deshabilitar",
            cancelText: "Cancelar",
            inputValidator: (value) => value.trim().length < 10
                ? "La justificación debe tener al menos 10 caracteres."
                : "",
        });

        return result.isConfirmed
            ? { deactivationReason: result.value.trim() }
            : false;
    };

    return (
        <ActiveSwitch
            id={user.id}
            isActive={user.is_active}
            toggleFn={toggleUserActive}
            entity="usuario"
            beforeToggle={requestDeactivationReason}
        />
    );
}

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
