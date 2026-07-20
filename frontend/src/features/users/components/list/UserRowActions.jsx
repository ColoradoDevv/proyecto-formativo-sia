import { IconButton } from "@/shared";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Acciones por fila de usuario: editar y visualizar.
// El cambio de estado (habilitar/deshabilitar) vive en su propia columna (ActiveSwitch).
export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  const handleEdit = () => navigate(`/usuarios/editar/${user.id}`);
  const handleVisualizer = () => navigate(`/usuarios/visualizar/${user.id}`);

  return (
    <div className="flex gap-2">
      <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
        <Pencil size={16} />
      </IconButton>
      <IconButton onClick={handleVisualizer} variant="ghost" hitSize={32} iconSize={16}>
        <Eye size={16} />
      </IconButton>
    </div>
  );
}
