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
        .max(20, "La placa SENA es demasiado larga")
        .refine(val => val === "" || val.length >= 3, {
            message: "La placa SENA debe tener minimo 3 caracteres"
        })
        .optional(),

    cmQuantity: z
        .string()
        .trim()
        .optional(),

    cmLocation: z
        .string()
        .trim()
        .min(3, "La ubicacion debe tener minimo 3 caracteres")
        .max(100, "La ubicacion es demasiado larga")
        .optional()
        ,

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
    cmUser: z
        .string()
        .min(1, "Debe seleccionar un cuentadante"),
    cmPurchaseDate: z   
        .string()
        .min(1, "Debe ingresar la fecha de compra"),

    cmPhoto: z
        .array(z.instanceof(File))
        .min(1, "Debe subir una imagen")
        .refine(
            (files) => ["image/jpeg", "image/png", "image/svg+xml"].includes(files[0]?.type),
            { message: "La imagen debe ser JPG, PNG o SVG" }
        )
        .refine(
            (files) => files[0]?.size <= 2 * 1024 * 1024,
            { message: "La imagen no puede superar 2MB" }
        ),
}).superRefine((data, ctx) => {

    // Cantidad obligatoria si no hay placa SENA
    if (!data.cmSenaPlate || data.cmSenaPlate.trim() === "") {
        if (!data.cmQuantity || data.cmQuantity.trim() === "") {
            ctx.addIssue({
                path: ["cmQuantity"],
                message: "La cantidad es obligatoria si no hay placa SENA",
                code: z.ZodIssueCode.custom,
            });
            return; // no seguir validando si falta la cantidad
        }
        if (Number(data.cmQuantity) <= 0) {
            ctx.addIssue({
                path: ["cmQuantity"],
                message: "La cantidad debe ser mayor a 0",
                code: z.ZodIssueCode.custom,
            });
        }
    }

    // Validación total = cantidad × valor unitario (solo si hay cantidad)
    if (data.cmQuantity && data.cmUnitValue && data.cmTotalValue) {
        if (toCents(data.cmUnitValue) * Number(data.cmQuantity) !== toCents(data.cmTotalValue)) {
            ctx.addIssue({
                path: ["cmTotalValue"],
                message: "El valor total debe ser igual a cantidad por valor unitario",
                code: z.ZodIssueCode.custom,
            });
        }
    }
});
