import { useState, useEffect } from "react";
import { Plus, ArrowLeft, ClipboardList, Search } from "lucide-react";
import { Input, TextArea, Select, Button, Modal, showAlert } from "@/shared";
import { taskSchema, TASK_STATES } from "../schemas/taskSchema";
import { getTasks, getTasksByUser, createTask } from "../services/taskService";
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
    onRemovePending,
}) {
    const isPersisted = Boolean(userId);

    // "list" muestra las tareas; "form" muestra el formulario de creacion.
    const [view, setView] = useState("list");

    const [tasks, setTasks] = useState([]);       // tareas de BD (modo editar)
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(EMPTY_TASK);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Vista "existing": todas las tareas del sistema para reasignar
    const [allTasks,     setAllTasks]     = useState([]);
    const [taskSearch,   setTaskSearch]   = useState("");
    const [loadingAll,   setLoadingAll]   = useState(false);

    // Al abrir: carga tareas del usuario (si existe) y resetea la vista.
    useEffect(() => {
        if (!isOpen) return;

        setView("list");
        setFormData(EMPTY_TASK);
        setErrors({});
        setTaskSearch("");

        if (isPersisted) {
            setLoading(true);
            getTasksByUser(userId)
                .then(setTasks)
                .catch(() => setTasks([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen, userId, isPersisted]);

    // Cargar todas las tareas al entrar a la vista "existing"
    useEffect(() => {
        if (view !== "existing") return;
        setLoadingAll(true);
        getTasks()
            .then(setAllTasks)
            .catch(() => setAllTasks([]))
            .finally(() => setLoadingAll(false));
    }, [view]);

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

    const titleMap = { list: "Tareas", form: "Nueva Tarea", existing: "Tareas existentes" };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={titleMap[view] ?? "Tareas"}
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
                                    <div className="flex items-center gap-2 shrink-0">
                                        <TaskStateBadge state={task.state} />
                                        {/* Quitar tarea pendiente (solo en modo registro) */}
                                        {!isPersisted && onRemovePending && (
                                            <button
                                                type="button"
                                                onClick={() => onRemovePending(task.key)}
                                                className="text-text-muted hover:text-error transition-colors text-base leading-none"
                                                aria-label={`Quitar tarea ${task.title}`}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-center py-6">
                            <ClipboardList size={32} className="text-text-muted" />
                            <p className="text-small text-text-muted">
                                Este usuario no tiene tareas todavía.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button type="button" variant="primary" size="md" className="flex gap-2 justify-center" onClick={() => setView("form")}>
                            <Plus size={16} />
                            Crear nueva tarea
                        </Button>
                        <Button type="button" variant="secondary" size="md" className="flex gap-2 justify-center" onClick={() => setView("existing")}>
                            <Search size={16} />
                            Asignar tarea existente
                        </Button>
                    </div>
                </div>
            )}

            {/* VISTA TAREAS EXISTENTES */}
            {view === "existing" && (
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className="flex items-center gap-1 text-small text-text-muted hover:text-text-secondary w-fit cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        Volver
                    </button>

                    <Input
                        placeholder="Buscar tarea por nombre…"
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                    />

                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                        {loadingAll ? (
                            <p className="text-small text-text-muted text-center py-6">Cargando tareas…</p>
                        ) : (() => {
                            const q = taskSearch.trim().toLowerCase();
                            const filtered = allTasks.filter((t) =>
                                (t.name ?? "").toLowerCase().includes(q)
                            );
                            if (filtered.length === 0)
                                return <p className="text-small text-text-muted text-center py-6">No hay tareas que coincidan.</p>;
                            return filtered.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between gap-3 bg-surface-hover border border-border rounded-[var(--radius-xl)] px-4 py-2.5"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-small text-text-primary truncate font-medium">{t.name}</span>
                                        {t.description && (
                                            <span className="text-[11px] text-text-muted truncate">{t.description}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <TaskStateBadge state={t.state} />
                                        <Button
                                            type="button"
                                            variant="soft"
                                            size="sm"
                                            onClick={() => {
                                                // En modo registro: agregar a la lista en memoria como tarea nueva con los datos de la existente
                                                if (!isPersisted) {
                                                    onAddPending?.({
                                                        taskName:        t.name,
                                                        taskDescription: t.description ?? "",
                                                        taskState:       t.state ?? "Pendiente",
                                                        taskStartDate:   t.start_date ?? "",
                                                        taskEndDate:     t.end_date   ?? "",
                                                    });
                                                    setView("list");
                                                } else {
                                                    // En modo editar: crear una copia asignada a este usuario
                                                    setSubmitting(true);
                                                    createTask({
                                                        taskName:        t.name,
                                                        taskDescription: t.description ?? "",
                                                        taskState:       t.state ?? "Pendiente",
                                                        taskStartDate:   t.start_date ?? "",
                                                        taskEndDate:     t.end_date   ?? "",
                                                        taskUser:        String(userId),
                                                    })
                                                        .then((created) => {
                                                            setTasks((prev) => [...prev, created]);
                                                            setView("list");
                                                            showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Tarea asignada correctamente" });
                                                        })
                                                        .catch((err) => {
                                                            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al asignar tarea", text: err.message });
                                                        })
                                                        .finally(() => setSubmitting(false));
                                                }
                                            }}
                                        >
                                            Asignar
                                        </Button>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
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
