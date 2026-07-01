import { z } from "zod";

// Comprueba que el string sea una fecha real (rechaza "2024-13-40", "0000-00-00").
function isValidDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(`${value}T00:00:00`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === y &&
        date.getMonth() + 1 === m &&
        date.getDate() === d
    );
}

export const taskSchema = z.object({

    taskName: z
        .string()
        .trim()
        .min(3, "El título debe tener mínimo 3 caracteres")
        .max(100, "El título es demasiado largo"),

    taskDescription: z
        .string()
        .trim()
        .min(3, "La descripción debe tener mínimo 3 caracteres")
        .max(255, "La descripción no puede superar 255 caracteres"),

    taskUser: z
        .string()
        .min(1, "Debe seleccionar un usuario"),

    taskState: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    taskStartDate: z
        .string()
        .min(1, "Debe ingresar una fecha de inicio")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" }),

    taskEndDate: z
        .string()
        .min(1, "Debe ingresar una fecha de finalización")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" }),

})
.refine(
    (data) => !data.taskStartDate || !data.taskEndDate || data.taskEndDate >= data.taskStartDate,
    { message: "La fecha de fin no puede ser anterior a la de inicio", path: ["taskEndDate"] }
);

// Estados disponibles para una tarea (RFADMIN46). Reutilizable en selects.
export const TASK_STATES = [
    { id: "Pendiente", label: "Pendiente" },
    { id: "En progreso", label: "En progreso" },
    { id: "Completada", label: "Completada" },
    { id: "Cancelada", label: "Cancelada" },
];
