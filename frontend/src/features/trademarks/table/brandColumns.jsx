import BrandRowActions from "../components/list/BrandRowActions";

export const brandColumns = (setBrands, setNotification) => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
            <BrandRowActions
                brand={row.original}
                onUpdate={setBrands}
                onNotify={setNotification}
            />
        ),
    },
];
