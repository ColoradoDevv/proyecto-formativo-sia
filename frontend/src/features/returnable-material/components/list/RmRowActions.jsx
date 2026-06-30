import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@/shared";

import { EllipsisVertical, Eye, Pencil} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RmRowActions({ Rm }) {
    const navigate = useNavigate();

    const handleVisualizar = () => {
        navigate(`/devolutivos/visualizar/${Rm.consumable_id}`);
    };

    const handleEdit = () => {
        navigate(`/devolutivos/editar/${Rm.consumable_id}`);
    };
    return (
        <div className="flex gap-2">
            <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
                <Pencil size={16} />
            </IconButton>

            <IconButton onClick={handleVisualizar} variant="ghost" hitSize={32} iconSize={16}>
                <Eye size={16} />
            </IconButton>

            <Dropdown>
                <DropdownTrigger className="inline-flex justify-center items-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] rounded-[var(--radius-full)] text-text-secondary hover:bg-surface-muted transition-colors duration-[var(--duration-base)]">
                    <EllipsisVertical size={16} />
                </DropdownTrigger>

                <DropdownContent className="w-48">
                    <DropdownItem onClick={() => navigate(`/devolutivos/editar/${Rm.consumable_id}`)}>Editar</DropdownItem>
                    <DropdownItem>Añadir Novedad</DropdownItem>
                    <DropdownItem>Deshabilitar</DropdownItem>
                </DropdownContent>
            </Dropdown>
        </div>
    );
}
