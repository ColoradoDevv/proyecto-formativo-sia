import { setSession, clearSession } from "@/shared/services/api";

// METODO POST - inicia sesion y guarda el token
export async function login(email, password) {
    const response = await fetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    // El backend devuelve 401 si las credenciales son invalidas
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.error || "No se pudo iniciar sesión");
        error.status = response.status;
        throw error;
    }

    const data = await response.json();

    // Guardamos token + datos del usuario en la sesion
    setSession(data.token, data.user);

    return data;
}

// METODO POST - solicita el envio del correo de recuperacion de contraseña
export async function requestPasswordReset(email) {
    const response = await fetch("/api/users/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.error || "No se pudo enviar el correo de recuperación");
        error.status = response.status;
        throw error;
    }

    return response.json().catch(() => ({}));
}

// METODO POST - define la nueva contraseña usando el token del correo
export async function resetPassword(token, password, confirmPassword) {
    const response = await fetch("/api/users/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirm_password: confirmPassword }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.error || "No se pudo restablecer la contraseña");
        error.status = response.status;
        throw error;
    }

    return response.json().catch(() => ({}));
}

// Cierra la sesion (borra el token guardado)
export function logout() {
    clearSession();
}