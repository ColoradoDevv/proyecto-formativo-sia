import { Switch } from "@/shared";
import RmRowActions from "../components/list/RmRowActions";
import { toggleRMActive } from "../services/returnableService";

export const RmColumns = (setRMs, setNotification) => [
    {
        accessorKey: "consumable_id",
        header: "Id",
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "state",
        header: "Estado",
    },
    {
        id: "category",
        header: "Categoría",
        accessorFn: (row) => row.category?.name ?? "—",
    },
    {
        id: "brand",
        header: "Marca",
        accessorFn: (row) => row.brand?.name ?? "—",
    },
    {
        accessorKey: "serial",
        header: "Serial",
    },
    {
        accessorKey: "is_active",
        header: "Activo",
        cell: ({ row }) => {
            const rm = row.original;

            const handleChange = async (value) => {
                try {
                    await toggleRMActive(rm.consumable_id, value);
                    setRMs((prev) =>
                        prev.map((item) =>
                            item.consumable_id === rm.consumable_id
                                ? { ...item, is_active: value }
                                : item
                        )
                    );
                    setNotification({ severity: "success", message: "Estado actualizado." });
                } catch {
                    setNotification({ severity: "error", message: "Error al actualizar estado." });
                }
            };

            return (
                <Switch
                    checked={rm.is_active}
                    onChange={handleChange}
                    className="inline-flex"
                />
            );
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <RmRowActions Rm={row.original} />,
    },
];
