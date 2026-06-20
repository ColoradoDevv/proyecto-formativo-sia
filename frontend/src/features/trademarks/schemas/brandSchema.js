import { z } from "zod";

export const brandSchema = z.object({
    brandName: z
        .string()
        .trim()
        .min(2, "El nombre debe tener mínimo 2 caracteres")
        .max(100, "El nombre es demasiado largo"),
});
