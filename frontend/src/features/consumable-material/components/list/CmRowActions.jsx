import { IconButton, promptAlert, showAlert } from "@/shared";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteCm } from "../../services/consumableService";

// Acciones de cada fila de material de consumo: editar y visualizar.
// El cambio de estado (habilitar/deshabilitar) vive en su propia columna (ActiveSwitch).
export default function CmRowActions({ cm, onDeleted }) {
    const navigate = useNavigate();

    const handleEdit = () => navigate(`/consumibles/editar/${cm.id}`);
    const handleVisualizer = () => navigate(`/consumibles/visualizar/${cm.id}`);
    const requestDeletionReason = async () => {
        const result = await promptAlert({
            icon: "warning",
            iconColor: "var(--color-warning)",
            title: "Motivo de eliminación",
            text: `Indique el motivo para eliminar el material ${cm.name}. Esta acción no se puede deshacer.`,
            inputLabel: "Motivo de eliminación",
            inputPlaceholder: "Describa el motivo de la eliminación",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            inputValidator: (value) => value.trim().length < 10
                ? "El motivo debe tener al menos 10 caracteres."
                : "",
        });

        return result.isConfirmed ? result.value.trim() : false;
    };

    const handleDelete = async () => {
        const deletionReason = await requestDeletionReason();
        if (!deletionReason) return;

        try {
            await deleteCm(cm.id, deletionReason);
            onDeleted?.(cm.id);
            showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Material eliminado correctamente" });
        } catch (error) {
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "No se pudo eliminar el material", text: error.message });
        }
    };

    return (
        <div className="flex gap-2">
            <IconButton onClick={handleEdit} variant="ghost" hitSize={32} iconSize={16}>
                <Pencil size={16} />
            </IconButton>
            <IconButton onClick={handleVisualizer} variant="ghost" hitSize={32} iconSize={16}>
                <Eye size={16} />
            </IconButton>
            <IconButton onClick={handleDelete} variant="ghost" hitSize={32} iconSize={16} ariaLabel="Eliminar material">
                <Trash2 size={16} />
            </IconButton>
        </div>
    );
}
