import { apiFetch, throwApiError } from "@/shared/services/api";

// Mapea los campos del backend a las keys del formulario, para mostrar
// el error de validacion junto al input correcto.
const FIELD_MAP = {
    user: "taskUser",
    name: "taskName",
    description: "taskDescription",
    start_date: "taskStartDate",
    end_date: "taskEndDate",
    state: "taskState",
};

export async function getTasks() {
    const response = await apiFetch("/api/tasks/");
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function getTaskById(id) {
    const response = await apiFetch(`/api/tasks/${id}/`);
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

// Tareas asignadas a un usuario especifico.
export async function getTasksByUser(userId) {
    const response = await apiFetch(`/api/tasks/?user=${userId}`);
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function createTask(taskData) {
    const response = await apiFetch("/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: taskData.taskUser,
            name: taskData.taskName,
            description: taskData.taskDescription,
            start_date: taskData.taskStartDate,
            end_date: taskData.taskEndDate,
            state: taskData.taskState,
        }),
    });
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

// El usuario asignado no se reenvia: una tarea no puede reasignarse (RFADMIN49).
export async function updateTask(id, taskData) {
    const response = await apiFetch(`/api/tasks/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: taskData.taskName,
            description: taskData.taskDescription,
            start_date: taskData.taskStartDate,
            end_date: taskData.taskEndDate,
            state: taskData.taskState,
        }),
    });
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function deleteTask(id, deletionReason) {
    const payload = deletionReason ? { deletion_reason: deletionReason } : undefined;

    const response = await apiFetch(`/api/tasks/${id}/`, {
        method: "DELETE",
        headers: payload ? { "Content-Type": "application/json" } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!response.ok) await throwApiError(response, FIELD_MAP);
}
