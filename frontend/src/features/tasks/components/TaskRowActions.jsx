import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownItem,
    showAlert,
    cancelAlert,
} from "@/shared";
import { EllipsisVertical, Pencil } from "lucide-react";
import { deleteTask } from "../services/taskService";

export default function TaskRowActions({ task, onEdit, onDeleted, onNotify }) {

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
