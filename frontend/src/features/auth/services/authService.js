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

// Cierra la sesion (borra el token guardado)
export function logout() {
    clearSession();
}