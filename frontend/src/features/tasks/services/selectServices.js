import { apiFetch } from "@/shared/services/api";

// Lista de usuarios para el selector de "usuario asignado".
export async function getUsers() {
    const response = await apiFetch("/api/users/");
    const data = await response.json();
    return data.map((user) => ({ id: String(user.id), label: `${user.first_name} ${user.last_name}` }));
}
