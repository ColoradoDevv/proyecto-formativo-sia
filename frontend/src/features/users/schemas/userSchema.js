import { z } from "zod";

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

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
        .min(1, "Debe ingresar una fecha de inicio")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" }),

    userEndDate: z
        .string()
        .min(1, "Debe ingresar una fecha de finalización")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" }),

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


// Schema para EDICION: usa los nombres de campo locales del UserEditView.
// No incluye confirmacion de correo ni contrasena (no se editan aqui) y la
// foto/fecha fin son opcionales; si la fecha fin viene, debe ser >= inicio.
export const userEditSchema = z.object({
    firstName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo")
        .regex(nameRegex, "Solo se permiten letras y espacios"),

    lastName: z
        .string()
        .min(3, "El apellido debe tener mínimo 3 caracteres")
        .max(60, "El apellido es demasiado largo")
        .regex(nameRegex, "Solo se permiten letras y espacios"),

    documentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    documentNumber: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(5, "Número de documento inválido")
        .max(15, "Número de documento demasiado largo"),

    address: z
        .string()
        .min(10, "La dirección debe tener mínimo 10 caracteres")
        .max(100, "La dirección no puede superar 100 caracteres"),

    email: z
        .string()
        .email("Debe ingresar un email válido"),

    institutionalEmail: z
        .string()
        .email("Debe ingresar un email válido")
        .or(z.literal(""))
        .optional(),

    phone: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(7, "Mínimo 7 dígitos")
        .max(15, "Máximo 15 dígitos"),

    additionalPhone: z
        .string()
        .regex(/^\d+$/, "Solo se permiten números")
        .min(7, "Mínimo 7 dígitos")
        .max(15, "Máximo 15 dígitos")
        .or(z.literal(""))
        .optional(),

    groups: z
        .array(z.string())
        .min(1, "Debe seleccionar al menos un grupo"),

    isActive: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    startDate: z
        .string()
        .min(1, "Debe ingresar una fecha de inicio")
        .refine(isValidDateString, { message: "Debe ingresar una fecha válida" }),

    endDate: z
        .string()
        .refine((val) => val === "" || isValidDateString(val), {
            message: "Debe ingresar una fecha válida",
        })
        .optional(),

    profilePicture: z
        .array(z.any())
        .optional(),
})
.refine(
    (data) => !data.institutionalEmail || data.institutionalEmail !== data.email,
    { message: "No puede coincidir con el correo personal", path: ["institutionalEmail"] }
)
.refine(
    (data) => !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: "La fecha de finalización no puede ser anterior a la de inicio", path: ["endDate"] }
);
