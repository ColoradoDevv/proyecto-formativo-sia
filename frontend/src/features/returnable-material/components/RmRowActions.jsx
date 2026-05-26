import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@/shared";

import { EllipsisVertical, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RmRowActions({ Rm }) {
    const navigate = useNavigate();

    const handleVisualizar = () => {
        navigate(`/devolutivos/visualizar/${Rm.id}`);
    };

    return (
        <div className="flex gap-2">
            <IconButton onClick={handleVisualizar} variant="ghost" hitSize={32} iconSize={16}>
                <Eye size={16} />
            </IconButton>

            <Dropdown>
                <DropdownTrigger className="inline-flex justify-center items-center w-8 h-8 rounded-full text-text-secondary hover:bg-surface-muted transition-colors duration-200">
                    <EllipsisVertical size={16} />
                </DropdownTrigger>

                <DropdownContent className="w-48">
                    <DropdownItem onClick={() => navigate(`/devolutivos/editar/${Rm.id}`)}>Editar</DropdownItem>
                    <DropdownItem>Añadir Novedad</DropdownItem>
                    <DropdownItem>Deshabilitar</DropdownItem>
                </DropdownContent>
            </Dropdown>
        </div>
    );
}
