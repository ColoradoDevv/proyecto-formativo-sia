import { z } from "zod";

export const taskSchema = z.object({

    taskName: z
        .string()
        .trim()
        .min(3, "El nombre de la tarea debe tener mínimo 3 caracteres")
        .max(100, "El nombre de la tarea es demasiado largo"),

    taskDescription: z
        .string()
        .trim()
        .max(255, "La descripción no puede superar 255 caracteres")
        .optional(),

    taskStartDate: z
        .string()
        .min(1, "Debe ingresar una fecha de inicio"),

    taskEndDate: z
        .string()
        .min(1, "Debe ingresar una fecha de finalización"),

})
.refine(
    (data) => !data.taskStartDate || !data.taskEndDate || data.taskEndDate >= data.taskStartDate,
    { message: "La fecha de finalización no puede ser anterior a la de inicio", path: ["taskEndDate"] }
);
