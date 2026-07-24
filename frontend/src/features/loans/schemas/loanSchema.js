import { z } from "zod";

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

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

// Antes era un objeto estatico `loanSchema`; ahora es una funcion porque la
// validacion de cantidad depende del stock disponible de cada material,
// que solo se conoce en tiempo de ejecucion (viene de `materials`).
export default function loanSchema(materials = []) {
    return z.object({
        loanResponsableUser: z
            .string()
            .min(1, "Debe seleccionar un usuario responsable"),

        loanReceptorUser: z
            .string()
            .min(1, "Debe seleccionar un usuario receptor"),

        loanMaterial: z
            .string()
            .min(1, "Debe seleccionar un material"),

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
            .refine(isValidDateString, { message: "Debe ingresar una fecha válida" })
            .refine((value) => value >= getTodayDateString(), {
                message: "La fecha de devolucion no puede ser anterior a hoy",
            }),
    }).superRefine((data, ctx) => {
        const material = materials.find((m) => String(m.id) === String(data.loanMaterial));

        if (
            material &&
            material.available_quantity != null &&
            Number(data.loanAmount) > material.available_quantity
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["loanAmount"],
                message: `Solo hay ${material.available_quantity} unidades disponibles de este material.`,
            });
        }
    });
}