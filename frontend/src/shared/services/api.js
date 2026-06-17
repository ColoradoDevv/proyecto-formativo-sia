//
// Capa central de comunicacion con el backend.
// Guarda la sesion (token + usuario) y adjunta el token en cada peticion.
//

const TOKEN_KEY = "sia_token";
const USER_KEY = "sia_user";

// --- Manejo de la sesion en sessionStorage ---

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
    return Boolean(getToken());
}

// --- Wrapper de fetch que adjunta el token automaticamente ---

export async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = { ...(options.headers || {}) };

    // Si hay token, lo mandamos en el header Authorization
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    // Si el token expiro o es invalido, limpiamos la sesion
    if (response.status === 401) {
        clearSession();
    }

    return response;
}