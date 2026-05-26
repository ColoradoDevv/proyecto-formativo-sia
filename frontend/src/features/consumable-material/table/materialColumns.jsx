import { Switch } from "@/shared";
import UserRowActions from "../components/list/UserRowActions";

export const materialColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "cm_name",
        header: "Nombre",
    },
    {
        accessorKey: "cm_brand",
        header: "Marca",
    },
    {
        accessorKey: "cm_state",
        header: "Estado",
    },
    {
        accessorKey: "cm_quantity",
        header: "Cantidad",
    },
    {
        accessorKey: "cm_location",
        header: "Ubicación",
    },
    {
        accessorKey: "is_active",
        header: "Activo",
        cell: ({ row }) => {
            const material = row.original;

            const handleChange = (value) => {
                console.log("Actualizar estado material:", material.id, value);
            };

            return (
                <Switch
                    checked={material.is_active}
                    onChange={handleChange}
                    className="inline-flex"
                />
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <UserRowActions user={row.original} />,
    },
];
