import { z } from "zod";

function isValidMoney(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
}

function toCents(value) {
    return Math.round(Number(value) * 100);
}

export const cmSchema = z.object({
    cmName: z
        .string()
        .trim()
        .min(3, "El nombre debe tener minimo 3 caracteres")
        .max(100, "El nombre es demasiado largo"),

    cmDescription: z
        .string()
        .trim()
        .min(10, "La descripcion debe tener minimo 10 caracteres")
        .max(255, "La descripcion es demasiado larga"),

    cmSenaPlate: z
        .string()
        .trim()
        .min(3, "La placa SENA debe tener minimo 3 caracteres")
        .max(20, "La placa SENA es demasiado larga"),

    cmQuantity: z
        .string()
        .trim()
        .min(1, "Debe ingresar la cantidad del material")
        .regex(/^\d+$/, "La cantidad debe ser un numero entero")
        .refine((value) => Number(value) > 0, {
            message: "La cantidad debe ser mayor a 0",
        }),

    cmLocation: z
        .string()
        .trim()
        .min(3, "La ubicacion debe tener minimo 3 caracteres")
        .max(100, "La ubicacion es demasiado larga"),

    cmBrand: z
        .string()
        .min(1, "Debe seleccionar una marca"),

    cmState: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    cmUnitValue: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor unitario")
        .refine(isValidMoney, {
            message: "El valor unitario debe ser un numero valido",
        })
        .refine((value) => Number(value) > 0, {
            message: "El valor unitario debe ser mayor a 0",
        }),

    cmTotalValue: z
        .string()
        .trim()
        .min(1, "Debe ingresar el valor total")
        .refine(isValidMoney, {
            message: "El valor total debe ser un numero valido",
        })
        .refine((value) => Number(value) > 0, {
            message: "El valor total debe ser mayor a 0",
        }),
}).refine(
    (data) => toCents(data.cmUnitValue) * Number(data.cmQuantity) === toCents(data.cmTotalValue),
    {
        message: "El valor total debe ser igual a cantidad por valor unitario",
        path: ["cmTotalValue"],
    }
);
