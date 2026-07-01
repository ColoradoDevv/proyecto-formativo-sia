import TaskRowActions from "../components/TaskRowActions";
import TaskStateBadge from "../components/TaskStateBadge";

export const taskColumns = ({ onEdit, onDeleted, onNotify }) => [
    {
        accessorKey: "name",
        header: "Título",
    },
    {
        accessorKey: "user_name",
        header: "Usuario asignado",
    },
    {
        accessorKey: "start_date",
        header: "Fecha inicio",
    },
    {
        accessorKey: "end_date",
        header: "Fecha fin",
    },
    {
        accessorKey: "state",
        header: "Estado",
        cell: ({ row }) => <TaskStateBadge state={row.original.state} />,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
            <TaskRowActions
                task={row.original}
                onEdit={onEdit}
                onDeleted={onDeleted}
                onNotify={onNotify}
            />
        ),
    },
];
