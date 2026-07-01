import { useState, useEffect } from "react";
import { Plus, ArrowLeft, ClipboardList } from "lucide-react";
import { Input, TextArea, Select, Button, Modal, showAlert } from "@/shared";
import { taskSchema, TASK_STATES } from "../schemas/taskSchema";
import { getTasksByUser, createTask } from "../services/taskService";
import TaskStateBadge from "./TaskStateBadge";

const EMPTY_TASK = {
    taskName: "",
    taskDescription: "",
    taskState: "Pendiente",
    taskStartDate: "",
    taskEndDate: "",
};

// Modal para gestionar las tareas asociadas a un usuario.
// - Con `userId`  -> lista las tareas reales del usuario (BD) y las crea con persistencia.
// - Sin `userId`  -> trabaja con tareas "pendientes" en memoria (registro de usuario);
//                    se persistiran cuando el usuario se cree (lo hace UserRegisterForm).
export default function UserTasksModal({
    isOpen,
    onClose,
    userId = null,
    pendingTasks = [],
    onAddPending,
}) {
    const isPersisted = Boolean(userId);

    // "list" muestra las tareas; "form" muestra el formulario de creacion.
    const [view, setView] = useState("list");

    const [tasks, setTasks] = useState([]);       // tareas de BD (modo editar)
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(EMPTY_TASK);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Al abrir: carga tareas del usuario (si existe) y resetea la vista.
    useEffect(() => {
        if (!isOpen) return;

        setView("list");
        setFormData(EMPTY_TASK);
        setErrors({});

        if (isPersisted) {
            setLoading(true);
            getTasksByUser(userId)
                .then(setTasks)
                .catch(() => setTasks([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen, userId, isPersisted]);

    // Tareas a mostrar segun el modo.
    const displayTasks = isPersisted
        ? tasks.map((t) => ({ key: t.id, title: t.name, state: t.state }))
        : pendingTasks.map((t, i) => ({ key: i, title: t.taskName, state: t.taskState }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // En registro no hay usuario aun; el campo taskUser no aplica en este modal,
        // asi que validamos un esquema sin esa parte agregando un user dummy.
        const candidate = { ...formData, taskUser: userId ? String(userId) : "pending" };
        const result = taskSchema.safeParse(candidate);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        // Modo registro: solo agregar a la lista en memoria.
        if (!isPersisted) {
            onAddPending?.(result.data);
            setFormData(EMPTY_TASK);
            setView("list");
            return;
        }

        // Modo editar: persistir en BD asignada a este usuario.
        setSubmitting(true);
        try {
            const created = await createTask({ ...result.data, taskUser: String(userId) });
            setTasks((prev) => [...prev, created]);
            setFormData(EMPTY_TASK);
            setView("list");
            showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Tarea creada exitosamente" });
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al crear la tarea", text: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    // Footer solo en la vista de formulario; la lista usa un boton inline.
    const footer = view === "form" ? (
        <>
            <Button type="button" variant="secondary" size="md" onClick={() => setView("list")} disabled={submitting}>
                Cancelar
            </Button>
            <Button type="submit" form="user-task-form" variant="primary" size="md" disabled={submitting}>
                {submitting ? "Guardando..." : "Crear"}
            </Button>
        </>
    ) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={view === "form" ? "Nueva Tarea" : "Tareas"}
            footer={footer}
        >
            {/* VISTA LISTA */}
            {view === "list" && (
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <p className="text-small text-text-muted text-center py-6">Cargando tareas...</p>
                    ) : displayTasks.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {displayTasks.map((task) => (
                                <div
                                    key={task.key}
                                    className="flex items-center justify-between gap-3 bg-surface-hover border border-border rounded-[var(--radius-xl)] px-4 py-2.5"
                                >
                                    <span className="text-small text-text-primary truncate" title={task.title}>
                                        {task.title}
                                    </span>
                                    <TaskStateBadge state={task.state} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty state: sin tareas -> invitar a crear una.
                        <div className="flex flex-col items-center gap-3 text-center py-6">
                            <ClipboardList size={32} className="text-text-muted" />
                            <p className="text-small text-text-muted">
                                Este usuario no tiene tareas todavía.
                            </p>
                        </div>
                    )}

                    <Button type="button" variant="primary" size="md" className="flex gap-2 justify-center" onClick={() => setView("form")}>
                        <Plus size={16} />
                        Crear nueva tarea
                    </Button>
                </div>
            )}

            {/* VISTA FORMULARIO */}
            {view === "form" && (
                <form id="user-task-form" noValidate onSubmit={handleCreate} className="flex flex-col gap-1">
                    {/* Volver a la lista */}
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className="flex items-center gap-1 text-small text-text-muted hover:text-text-secondary mb-2 w-fit cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        Volver a la lista
                    </button>

                    <Input
                        label="Título de la Tarea"
                        name="taskName"
                        placeholder="Ingrese el título de la tarea"
                        className="w-full"
                        value={formData.taskName}
                        onChange={handleChange}
                        error={errors.taskName}
                        required
                    />

                    <TextArea
                        label="Descripción"
                        name="taskDescription"
                        placeholder="Ingrese una descripción"
                        value={formData.taskDescription}
                        onChange={handleChange}
                        error={errors.taskDescription}
                        required
                    />

                    <Select
                        label="Estado"
                        name="taskState"
                        value={formData.taskState}
                        onChange={handleChange}
                        options={TASK_STATES}
                        error={errors.taskState}
                        required
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            label="Fecha Inicio"
                            name="taskStartDate"
                            type="date"
                            className="w-full min-w-0"
                            value={formData.taskStartDate}
                            onChange={handleChange}
                            error={errors.taskStartDate}
                            required
                        />
                        <Input
                            label="Fecha Fin"
                            name="taskEndDate"
                            type="date"
                            className="w-full min-w-0"
                            value={formData.taskEndDate}
                            onChange={handleChange}
                            error={errors.taskEndDate}
                            required
                        />
                    </div>
                </form>
            )}
        </Modal>
    );
}
