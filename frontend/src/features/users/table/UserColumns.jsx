// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import UserRowActions from "../components/list/UserRowActions";

// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const userColumns = [
  // Columna ID (oculta pero útil para acciones)
  {
    accessorKey: "id", // Campo del objeto user que se usará para esta columna
    header: "ID",
  },
  // Columna Nombre
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    id: "nombre",
    header: "Nombre",
  },
  // Columna Rol
  {
    accessorFn: (row) => row.role?.name ?? "Sin rol",
    id: "role",
    header: "Rol",
  },
  // Columna Tipo de documento
  {
    accessorFn: (row) => row.document_type?.name ?? "Sin tipo de documento",
    id: "document_type",
    header: "Tipo de Documento",
  },

  // Columna numero de documento
  {
    accessorKey: "document_number", // Campo del objeto user
    header: "Numero de Documento",
  },

  // Columna Dirección
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "phone_number",
    header: "Teléfono",
  },

  // Columna Estado (activo / inactivo)
  {
    accessorKey: "is_active",
    header: "Estado",

    // Render personalizado de la celda
    // Permite mostrar un componente en lugar de solo texto
    cell: ({ row }) => {
      // Se obtiene el objeto completo del usuario de la fila
      const user = row.original;

      // Función que se ejecuta cuando cambia el switch
      const handleChange = (value) => {
        // value representa el nuevo estado del switch (true o false)
        console.log("Actualizar estado usuario:", user.user_id, value);

        // Aquí normalmente se llamaría una API para actualizar el estado
        // updateUserStatus(user.user_id, value)
      };

      return (
        // Componente reutilizable para mostrar el switch
        <Switch
          checked={user.is_active} // Estado actual del usuario
          onChange={handleChange} // Función que maneja el cambio
          className="inline-flex"
        />
      );
    },
  },

  // Columna de acciones (editar / eliminar)
  {
    id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario
    header: "Acciones",

    // Renderiza el componente de acciones pasando el usuario completo
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
