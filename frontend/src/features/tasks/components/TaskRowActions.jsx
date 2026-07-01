import { IconButton, showAlert, cancelAlert } from "@/shared";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteTask } from "../services/taskService";

// Acciones de cada fila de tarea: visualizar, editar y eliminar (iconos, sin dropdown).
export default function TaskRowActions({ task, onView, onEdit, onDeleted, onNotify }) {

    const handleDelete = async () => {
        const result = await cancelAlert({
            title: "¿Eliminar esta tarea?",
            text: "Esta acción no se puede deshacer.",
            confirmText: "Sí, eliminar",
        });
        if (!result.isConfirmed) return;

        try {
            await deleteTask(task.id);
            onDeleted(task.id);
            showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Tarea eliminada exitosamente" });
        } catch (error) {
            onNotify?.({ severity: "error", message: error.message });
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al eliminar la tarea", text: error.message });
        }
    };

    return (
        <div className="flex gap-2">
            <IconButton onClick={() => onEdit(task)} variant="ghost" hitSize={32} iconSize={16}>
                <Pencil size={16} />
            </IconButton>
            <IconButton onClick={() => onView(task)} variant="ghost" hitSize={32} iconSize={16}>
                <Eye size={16} />
            </IconButton>
            <IconButton onClick={handleDelete} variant="ghost" hitSize={32} iconSize={16}>
                <Trash2 size={16} />
            </IconButton>
        </div>
    );
}
