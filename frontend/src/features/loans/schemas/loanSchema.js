import { z } from "zod";

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export const loanSchema = z.object({
    loanAmount: z
        .string()
        .trim()
        .min(1, "Debe ingresar la cantidad del prestamo")
        .regex(/^\d+$/, "La cantidad debe ser un numero entero")
        .refine((value) => Number(value) > 0, {
            message: "La cantidad debe ser mayor a 0",
        })
        .refine((value) => Number(value) <= 999999, {
            message: "La cantidad no puede superar 999999",
        }),

    loanGroup: z
        .string()
        .trim()
        .min(1, "Debe ingresar el grupo")
        .regex(/^\d+$/, "El grupo debe contener solo numeros")
        .max(10, "El grupo no puede tener mas de 10 caracteres"),

    loanJustification: z
        .string()
        .trim()
        .min(10, "La justificacion debe tener minimo 10 caracteres")
        .max(255, "La justificacion es demasiado larga"),

    loanReturnDate: z
        .string()
        .min(1, "Debe ingresar la fecha de devolucion")
        .refine((value) => value >= getTodayDateString(), {
            message: "La fecha de devolucion no puede ser anterior a hoy",
        }),
});
