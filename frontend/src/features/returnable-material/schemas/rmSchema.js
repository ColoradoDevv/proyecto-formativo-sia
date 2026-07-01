import { z } from "zod";

function isValidMoney(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
}

function toCents(value) {
    return Math.round(Number(value) * 100);
}

// Fecha de hoy en formato YYYY-MM-DD (lo que entrega un <input type="date">).
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

// Schema para CREACION. Usa la MISMA convencion de nombres que ReturnableForm
// (name, senaPlate, brand, ...) para poder reutilizar el formulario.
export const rmSchema = z.object({
    senaPlate: z
        .string()
        .trim()
        .min(3, "La placa SENA debe tener mínimo 3 caracteres")
        .max(20, "La placa SENA es demasiado larga"),

    name: z
        .string()
        .trim()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "El nombre es demasiado largo"),

    state: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    category: z
        .string()
        .min(1, "Debe seleccionar una categoría"),

    brand: z
        .string()
        .min(1, "Debe seleccionar una marca"),

    serial: z
        .string()
        .trim()
        .min(3, "El serial debe tener mínimo 3 caracteres")
        .max(20, "El serial es demasiado largo"),

    quantity: z
        .string()
        .trim()
        .min(1, "Debe ingresar la cantidad del material")
        .regex(/^\d+$/, "La cantidad debe ser un número entero")
        .refine((value) => Number(value) > 0, {
            message: "La cantidad debe ser mayor a 0",
        }),

    location: z
        .string()
        .trim()
        .optional(),

    unitPrice: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor unitario")
        .refine(isValidMoney, { message: "El valor unitario debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor unitario debe ser mayor a 0" }),

    totalPrice: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor total")
        .refine(isValidMoney, { message: "El valor total debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor total debe ser mayor a 0" }),

    description: z
        .string()
        .trim()
        .min(3, "La descripción debe tener mínimo 3 caracteres")
        .max(255, "La descripción es demasiado larga"),

    purchaseDate: z
        .string()
        .min(1, "Debe ingresar la fecha de compra")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" })
        .refine((value) => value <= getTodayDateString(), {
            message: "La fecha de compra no puede ser futura",
        }),

    technicalSheet: z.array(z.instanceof(File)).optional(),

    photo: z.array(z.instanceof(File)).optional(),
}).refine(
    (data) => toCents(data.unitPrice) * Number(data.quantity) === toCents(data.totalPrice),
    {
        message: "El valor total debe ser igual a cantidad × valor unitario",
        path: ["totalPrice"],
    }
);


// Schema para EDICION: usa los nombres de campo locales del RmEditView y no
// exige foto ni ficha tecnica (ya existen y solo se reemplazan si se suben).
export const rmEditSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "El nombre es demasiado largo"),

    senaPlate: z
        .string()
        .trim()
        .min(3, "La placa SENA debe tener mínimo 3 caracteres")
        .max(20, "La placa SENA es demasiado larga"),

    serial: z
        .string()
        .trim()
        .min(3, "El serial debe tener mínimo 3 caracteres")
        .max(20, "El serial es demasiado largo"),

    category: z
        .string()
        .min(1, "Debe seleccionar una categoría"),

    brand: z
        .string()
        .min(1, "Debe seleccionar una marca"),

    description: z
        .string()
        .trim()
        .min(3, "La descripción debe tener mínimo 3 caracteres")
        .max(255, "La descripción es demasiado larga"),

    state: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    quantity: z
        .string()
        .trim()
        .min(1, "Debe ingresar la cantidad del material")
        .regex(/^\d+$/, "La cantidad debe ser un número entero")
        .refine((value) => Number(value) > 0, { message: "La cantidad debe ser mayor a 0" }),

    location: z
        .string()
        .trim()
        .max(100, "La ubicación es demasiado larga")
        .refine((val) => val === "" || val.length >= 3, {
            message: "La ubicación debe tener mínimo 3 caracteres",
        })
        .optional(),

    unitPrice: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor unitario")
        .refine(isValidMoney, { message: "El valor unitario debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor unitario debe ser mayor a 0" }),

    totalPrice: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor total")
        .refine(isValidMoney, { message: "El valor total debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor total debe ser mayor a 0" }),

    purchaseDate: z
        .string()
        .min(1, "Debe ingresar la fecha de compra")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" })
        .refine((value) => value <= getTodayDateString(), {
            message: "La fecha de compra no puede ser futura",
        }),
}).refine(
    (data) => toCents(data.unitPrice) * Number(data.quantity) === toCents(data.totalPrice),
    {
        message: "El valor total debe ser igual a cantidad × valor unitario",
        path: ["totalPrice"],
    }
);
