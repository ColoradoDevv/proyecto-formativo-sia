import {
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/shared";
import { EllipsisVertical, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteBrand } from "../../services/brandService";

export default function BrandRowActions({ brand, onUpdate, onNotify }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/marcas/editar/${brand.id}`);
  };

  const handleView = () => {
    navigate(`/marcas/${brand.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) return;

    try {
      await deleteBrand(brand.id);
      onNotify({
        severity: "success",
        message: "Marca eliminada exitosamente",
      });
      onUpdate((prev) => prev.filter((b) => b.id !== brand.id));
    } catch (err) {
      onNotify({
        severity: "error",
        message: "Error al eliminar la marca",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <IconButton onClick={handleView} variant="ghost" hitSize={32} iconSize={16}>
        <Eye size={16} />
      </IconButton>

      <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
        <Pencil size={16} />
      </IconButton>

      <Dropdown>
        <DropdownTrigger className="inline-flex justify-center items-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] rounded-[var(--radius-full)] text-text-secondary hover:bg-surface-muted transition-colors duration-[var(--duration-base)]">
          <EllipsisVertical size={16} />
        </DropdownTrigger>

        <DropdownContent className="w-48">
          <DropdownItem onClick={handleDelete}>Eliminar</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
