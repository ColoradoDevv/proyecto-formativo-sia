import { Switch } from "@/shared";
import RmRowActions from "../components/RmRowActions";

export const RmColumns = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "rm_name",
        header: "RmName",
    },
    {
        accessorKey: "rm_state",
        header: "RmState",
    },
    {
        accessorKey: "rm_category",
        header: "rmCategory",
    },
    {
        accessorKey: "rm_brand",
        header: "RmBrand",
    },
    {
        accessorKey: "rm_serial",
        header: "RmSerial",
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
