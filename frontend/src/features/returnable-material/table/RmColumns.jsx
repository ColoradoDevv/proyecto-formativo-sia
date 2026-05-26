import { Switch } from "@/shared";
import RmRowActions from "../components/RmRowActions";

export const RmColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "rm_name",
        header: "Nombre",
    },
    {
        accessorKey: "rm_state",
        header: "Estado",
    },
    {
        accessorKey: "rm_category",
        header: "Categoría",
    },
    {
        accessorKey: "rm_brand",
        header: "Marca",
    },
    {
        accessorKey: "rm_serial",
        header: "Serial",
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const rm = row.original;

            const handleChange = (value) => {
                console.log("Actualizar estado préstamo:", rm.id, value);
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
        cell: ({ row }) => <RmRowActions Rm={row.original} />,
    },
];
