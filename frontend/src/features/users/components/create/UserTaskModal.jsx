import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Input, Button, TextArea, IconButton } from "@/shared";

export default function UserTaskModal({ isOpen, onClose, onAdd }) {

    const [taskData, setTaskData] = useState({
        taskName: "",
        taskDescription: "",
        taskStartDate: "",
        taskEndDate: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    const reset = () => setTaskData({ taskName: "", taskDescription: "", taskStartDate: "", taskEndDate: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...taskData });
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Fondo difuminado */}
            <div className="absolute inset-0 bg-slate-500/20 backdrop-blur-xs" />

            {/* Tarjeta glassmorphism */}
            <div className="relative z-10 w-md max-w-3xl mx-4 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] p-8 flex flex-col gap-5">

                {/* Encabezado */}
            <div className="flex items-center justify-between">
                    <h2 className="text-h3 font-heading text-text-primary">Agregar Tarea</h2>
                    <IconButton
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        <X size={16} />
                    </IconButton>
                </div>

                <div className="w-full h-px bg-border" />

                {/* Formulario */}
                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <Input
                        label="Nombre de la Tarea"
                        name="taskName"
                        placeholder="Ingrese el nombre de la tarea"
                        className="w-full"
                        value={taskData.taskName}
                        onChange={handleChange}
                        required
                    />

                    <TextArea
                        label="Descripción de la Tarea (Opcional)"
                        name="taskDescription"
                        placeholder="Ingrese una descripción"
                        value={taskData.taskDescription}
                        onChange={handleChange}
                    />

                    {/* Fechas en fila */}
                    <div className="flex gap-4">
                        <Input
                            label="Fecha Inicio"
                            name="taskStartDate"
                            type="date"
                            value={taskData.taskStartDate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Fecha Fin"
                            name="taskEndDate"
                            type="date"
                            value={taskData.taskEndDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="w-full h-px bg-border" />

                    {/* Acciones */}
                    <div className="flex gap-3 justify-end">
                        <Button type="button" variant="secondary" size="md" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md">
                            Crear
                        </Button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    );
}
