import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@/shared";

import { EllipsisVertical, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Acciones de cada fila de material de consumo.
export default function CmRowActions({ cm }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/consumibles/editar/${cm.id}`);
    };

    const handleVisualizer = () => {
        navigate(`/consumibles/visualizar/${cm.id}`);
    };

    return (
        <div className="flex gap-2">
            <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
                <Pencil size={16} />
            </IconButton>

            <IconButton onClick={handleVisualizer} variant="ghost" hitSize={32} iconSize={16}>
                <Eye size={16} />
            </IconButton>

            <Dropdown>
                <DropdownTrigger className="inline-flex justify-center items-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] rounded-[var(--radius-full)] text-text-secondary hover:bg-surface-muted transition-colors duration-[var(--duration-base)]">
                    <EllipsisVertical size={16} />
                </DropdownTrigger>

                <DropdownContent className="right-0 w-48">
                    <DropdownItem onClick={handleEdit}>Editar</DropdownItem>
                    <DropdownItem>Deshabilitar</DropdownItem>
                </DropdownContent>
            </Dropdown>
        </div>
    );
}
