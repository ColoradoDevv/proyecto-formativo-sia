import { IconButton } from "@/shared";
import { Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Acciones de cada fila de préstamo: editar y visualizar.
export default function LoansRowActions({ loan }) {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/prestamos/editar/${loan.id_loan}`);
    const handleVisualizer = () => navigate(`/prestamos/visualizar/${loan.id_loan}`);

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
