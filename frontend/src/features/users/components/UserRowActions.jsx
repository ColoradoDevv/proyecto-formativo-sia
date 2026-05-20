import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";

// Iconos usados en los botones de acciones
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

// Hook de React Router para navegar programáticamente entre rutas
import { Link, useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function UserRowActions({ user }) {
  // const handleEdit = () => {
  //   console.log("Editar usuario", user.id);
  // };

  // Hook que permite redirigir a otra ruta desde código
  const navigate = useNavigate();

  // Acción para editar el usuario
  // Redirige a la página de edición usando el id del usuario
  const handleEdit = () => {
    navigate(`/users/${user.id}/edit`);
  };

  // Acción para eliminar el usuario
  // Actualmente solo imprime en consola el id
  // En una aplicación real aquí se llamaría a la API


  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">
      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        variant="ghost"
        hitSize={32}
        iconSize={16}
      >
        <Pencil size={16} />
      </IconButton>

      {/* Botón opciones */}
      <Dropdown>
          <DropdownTrigger className="inline-flex justify-center items-center w-8 h-8 rounded-full text-text-secondary hover:bg-surface-muted transition-colors duration-200">
              <EllipsisVertical size={16} />
          </DropdownTrigger>

            <DropdownContent className="right-0 w-48">
                <DropdownItem>
                    <Link to="#" className="block w-full">Opcion 1</Link>
                </DropdownItem>
                <DropdownItem>
                    <Link to="#" className="block w-full">Opcion 2</Link>
                </DropdownItem>
                <DropdownItem>
                    <Link to="#" className="block w-full">Opcion 3</Link>
                </DropdownItem>
            </DropdownContent>
        </Dropdown>
    </div>
);
}
