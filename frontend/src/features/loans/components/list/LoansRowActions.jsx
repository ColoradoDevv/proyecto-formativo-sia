import { IconButton } from "@/shared";
import { Pencil, Eye, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Acciones de cada fila de préstamo: editar, visualizar y (si está activo) devolver.
export default function LoansRowActions({ loan, onReturn }) {
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
            {/* Devolver: solo para préstamos activos */}
            {loan.is_active && onReturn && (
                <IconButton
                    onClick={() => onReturn(loan)}
                    variant="ghost"
                    hitSize={32}
                    iconSize={16}
                    ariaLabel="Devolver material"
                >
                    <Undo2 size={16} />
                </IconButton>
            )}
        </div>
    );
}
