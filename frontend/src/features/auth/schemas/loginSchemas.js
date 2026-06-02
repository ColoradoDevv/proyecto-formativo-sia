import { z } from "zod";

export const loginSchemas = z.object({
    userEmail: z
        .string()
        .min(1, "El correo es obligatorio")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),

    userPassword: z
        .string()
        .min(1, "La contraseña es obligatoria"),
});