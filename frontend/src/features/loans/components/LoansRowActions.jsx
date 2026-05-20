import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
} from "@/shared";

import { EllipsisVertical, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoansRowActions({ loan }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/prestamos/${loan.id}/editar`);
    };

    return (
        <div className="flex gap-2">
            <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
                <Pencil size={16} />
            </IconButton>

            <Dropdown>
                <DropdownTrigger className="inline-flex justify-center items-center w-8 h-8 rounded-full text-text-secondary hover:bg-surface-muted transition-colors duration-200">
                    <EllipsisVertical size={16} />
                </DropdownTrigger>

                <DropdownContent className="w-48">
                    <DropdownItem>
                        <Link to="#" className="block w-full">Ver detalle</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="#" className="block w-full">Marcar devuelto</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="#" className="block w-full">Eliminar</Link>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>
        </div>
    );
}
