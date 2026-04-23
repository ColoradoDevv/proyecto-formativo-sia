import { z } from "zod";

export const userSchema = z.object({
    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userLastName: z
        .string()
        .min(3, "El apellido debe tener mínimo 3 caracteres")
        .max(60, "El apellido es demasiado largo"),

    userEmail: z
        .string()
        .email("Debe ingresar un email válido"),

    userConfirmEmail: z                      
        .string()
        .email("Debe ingresar un email válido"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
        .string()
        .min(5, "Número de documento invalido")
        .max(20, "Número de documento demasiado largo"),

    userPassword: z
        .string()
        .min(8, "Contraseña debe tener mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),

    userConfirmPassword: z                   
        .string()
        .min(1, "Debe confirmar su contraseña"),

    userStartDate: z                         
        .string()
        .min(1, "Debe ingresar una fecha de inicio"),

    userEndDate: z                           
        .string()
        .min(1, "Debe ingresar una fecha de finalización"),

}).refine(                                   
    (data) => data.userEmail === data.userConfirmEmail,
    {
        message: "Los correos no coinciden",
        path: ["userConfirmEmail"],
    }
).refine(                                    
    (data) => data.userPassword === data.userConfirmPassword,
    {
        message: "Las contraseñas no coinciden",
        path: ["userConfirmPassword"],
    }
);