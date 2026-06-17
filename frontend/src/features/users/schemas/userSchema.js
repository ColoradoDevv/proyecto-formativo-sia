import { z } from "zod";

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

export const userSchema = z.object({

    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo")
        .regex(nameRegex, "Solo se permiten letras y espacios"),

    userLastName: z
        .string()
        .min(3, "El apellido debe tener mínimo 3 caracteres")
        .max(60, "El apellido es demasiado largo")
        .regex(nameRegex, "Solo se permiten letras y espacios"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(5, "Número de documento inválido")
        .max(15, "Número de documento demasiado largo"),

    userGroups: z
        .array(z.string())
        .min(1, "Debe seleccionar al menos un grupo"),

    userStartDate: z
        .string()
        .min(1, "Debe ingresar una fecha de inicio"),

    userEndDate: z
        .string()
        .min(1, "Debe ingresar una fecha de finalización"),

    userEmail: z
        .string()
        .email("Debe ingresar un email válido"),

    userConfirmEmail: z
        .string()
        .email("Debe ingresar un email válido"),

    userInstitutionalEmail: z
        .string()
        .email("Debe ingresar un email válido")
        .or(z.literal(""))
        .optional(),

    userPhone: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(7, "Mínimo 7 dígitos")
        .max(15, "Máximo 15 dígitos"),

    userAdditionalPhone: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(7, "Mínimo 7 dígitos")
        .max(15, "Máximo 15 dígitos")
        .or(z.literal(""))
        .optional(),

    userAddress: z
        .string()
        .min(10, "La dirección debe tener mínimo 10 caracteres")
        .max(100, "La dirección no puede superar 100 caracteres"),

    userProfile: z
        .array(z.any())
        .optional(),

})
.refine(
    (data) => data.userEmail === data.userConfirmEmail,
    { message: "Los correos no coinciden", path: ["userConfirmEmail"] }
)
.refine(
    (data) => !data.userInstitutionalEmail || data.userInstitutionalEmail !== data.userEmail,
    { message: "No puede coincidir con el correo personal", path: ["userInstitutionalEmail"] }
)
.refine(
    (data) => !data.userStartDate || !data.userEndDate || data.userEndDate >= data.userStartDate,
    { message: "La fecha de finalización no puede ser anterior a la de inicio", path: ["userEndDate"] }
);
