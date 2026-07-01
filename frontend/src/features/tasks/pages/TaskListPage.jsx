import { useState, useEffect } from "react";
import { Button, DataTable } from "@/shared";
import { Plus, CloudAlert } from "lucide-react";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import useTasks from "../hooks/useTasks";
import { getUsers } from "../services/selectServices";
import { taskColumns } from "../table/taskColumns";
import TaskModal from "../components/TaskModal";

export default function TaskListPage() {
    const { tasks, setTasks, loading, error } = useTasks();
    const [users, setUsers] = useState([]);

    // Estado del modal: abierto y, si aplica, la tarea en edicion.
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => { getUsers().then(setUsers).catch(() => setUsers([])); }, []);

    const openCreate = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    // Tras crear/editar: refresca la fila en la lista sin recargar todo.
    const handleSaved = (saved, isEdit) => {
        setTasks((prev) =>
            isEdit ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved]
        );
    };

    const handleDeleted = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const columns = taskColumns({ onEdit: openEdit, onDeleted: handleDeleted });

    if (loading)
        return (
            <div className="h-full flex items-center justify-center py-12">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error)
        return (
            <div className="h-full flex items-center justify-center py-12">
                <div className="flex items-center gap-3 bg-text-secondary border border-text-secondary text-text-inverse rounded-lg px-6 py-4 max-w-md">
                    <span className="text-h1"><CloudAlert /></span>
                    <div>
                        <p className="font-heading">Error al cargar Tareas</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-primary font-heading">Tareas</h2>
                <Button className="flex gap-2" onClick={openCreate}>
                    <Plus size={18} />
                    Registrar Tarea
                </Button>
            </div>

            {/* Tabla (incluye buscador y paginacion propios) */}
            <DataTable data={tasks} columns={columns} />

            {/* Modal crear/editar */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
                users={users}
                task={editingTask}
            />
        </div>
    );
}
