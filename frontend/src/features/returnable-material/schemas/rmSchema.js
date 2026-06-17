import { z } from "zod";

function isValidMoney(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
}

function toCents(value) {
    return Math.round(Number(value) * 100);
}

export const rmSchema = z.object({
    rmSenaPlate: z
        .string()
        .trim()
        .min(3, "La placa SENA debe tener mínimo 3 caracteres")
        .max(20, "La placa SENA es demasiado larga"),

    rmName: z
        .string()
        .trim()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "El nombre es demasiado largo"),

    rmState: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    rmCategory: z
        .string()
        .min(1, "Debe seleccionar una categoría"),

    rmBrand: z
        .string()
        .min(1, "Debe seleccionar una marca"),

    rmSerial: z
        .string()
        .trim()
        .min(3, "El serial debe tener mínimo 3 caracteres")
        .max(20, "El serial es demasiado largo"),

    rmQuantity: z
        .string()
        .trim()
        .min(1, "Debe ingresar la cantidad del material")
        .regex(/^\d+$/, "La cantidad debe ser un número entero")
        .refine((value) => Number(value) > 0, {
            message: "La cantidad debe ser mayor a 0",
        }),

    rmUnitValue: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor unitario")
        .refine(isValidMoney, { message: "El valor unitario debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor unitario debe ser mayor a 0" }),

    rmTotalValue: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor total")
        .refine(isValidMoney, { message: "El valor total debe ser un número válido" })
        .refine((value) => Number(value) > 0, { message: "El valor total debe ser mayor a 0" }),

    rmDescription: z
        .string()
        .trim()
        .min(3, "La descripción debe tener mínimo 3 caracteres")
        .max(255, "La descripción es demasiado larga"),

    rmPurchaseDate: z
        .string()
        .min(1, "Debe ingresar la fecha de compra"),

    rmTechnicalSheet: z.array(z.instanceof(File)).optional(),

    rmPhoto: z.array(z.instanceof(File)).optional(),
}).refine(
    (data) => toCents(data.rmUnitValue) * Number(data.rmQuantity) === toCents(data.rmTotalValue),
    {
        message: "El valor total debe ser igual a cantidad × valor unitario",
        path: ["rmTotalValue"],
    }
);
