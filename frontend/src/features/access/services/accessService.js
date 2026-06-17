



import { apiFetch } from "@/shared/services/api";

export async function hasPermission(permissionCode) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${apiFetch}/check/${permissionCode}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error verificando permiso");
    }

    return response.json();
}