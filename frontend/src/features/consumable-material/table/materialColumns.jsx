import { ActiveSwitch, promptAlert } from "@/shared";
import { toggleCmActive } from "../services/consumableService";
import CmRowActions from "../components/list/CmRowActions";

const requestCmToggleReason = async (cm, newValue) => {
    const action = newValue ? "activación" : "desactivación";
    const result = await promptAlert({
        icon: "warning",
        iconColor: "var(--color-warning)",
        title: `Motivo de ${action}`,
        text: `Indique el motivo para ${newValue ? "activar" : "desactivar"} el material de consumo ${cm.name}.`,
        inputLabel: `Motivo de ${action}`,
        inputPlaceholder: `Describa el motivo de la ${action}`,
        confirmText: newValue ? "Activar" : "Desactivar",
        cancelText: "Cancelar",
        inputValidator: (value) => value.trim().length < 10
            ? "El motivo debe tener al menos 10 caracteres."
            : "",
    });

    return result.isConfirmed ? result.value.trim() : false;
};

export const materialColumns = (setCMs) => [
    {
        accessorFn: (row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : "Sin cuentadante",
        id: "user",
        header: "Cuentadante",
        meta: { filterVariant: "select" },
    },
    {
        accessorKey: "name",
        header: "Nombre del material",
    },
    {
        accessorKey: "quantity",
        header: "Cantidad disponible",
        cell: ({ row }) => {
            const { available_quantity, quantity, is_exhausted } = row.original;
            const display = available_quantity ?? quantity;
            if (display == null) return "—";
            return (
                <span className="flex items-center gap-1.5">
                    {display}
                    {is_exhausted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                            Agotado
                        </span>
                    )}
                </span>
            );
        },
    },
    {
        accessorKey: "state",
        header: "Disponibilidad",
        meta: { filterVariant: "select" },
        cell: ({ row }) => {
            const { state, is_exhausted } = row.original;
            return (
                <span className="flex items-center gap-1.5">
                    {state ?? "—"}
                    {is_exhausted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                            Agotado
                        </span>
                    )}
                </span>
            );
        },
    },
    {
        accessorKey: "location",
        header: "Ubicación",
    },
    {
        accessorKey: "purchase_date",
        header: "Fecha de compra",
        meta: { filterVariant: "date" },
    },
    {
        accessorFn: (row) => row.is_active ? "Activo" : "Inactivo",
        id: "is_active",
        header: "Estado",
        meta: { filterVariant: "select" },
        cell: ({ row }) => (
            <ActiveSwitch
                id={row.original.id}
                isActive={row.original.is_active}
                toggleFn={toggleCmActive}
                beforeToggle={(value) => requestCmToggleReason(row.original, value)}
                onToggled={(updatedMaterial) => {
                    setCMs((prev) => prev.map((item) =>
                        item.id === row.original.id
                            ? { ...item, is_active: updatedMaterial.is_active, state: updatedMaterial.state }
                            : item
                    ));
                }}
            />
        ),
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <CmRowActions cm={row.original} onDeleted={(id) => setCMs((prev) => prev.filter((item) => item.id !== id))} />,
    },
];
