import { Link } from "react-router-dom";
import BrandRowActions from "../components/list/BrandRowActions";

export const brandColumns = (setBrands, setNotification) => [
  {
    accessorKey: "id",
    header: "ID",
    size: 50,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <Link
        to={`/marcas/${row.original.id}`}
        className="text-brand hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => (
      <span className={`px-3 py-0.5 rounded-[var(--radius-full)] text-caption font-medium ${
        row.original.is_active ? "bg-success-soft text-success" : "bg-error-soft text-error"
      }`}>
        {row.original.is_active ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    id: "acciones",
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
