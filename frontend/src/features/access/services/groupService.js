import { apiFetch, throwApiError } from "@/shared/services/api";

// METODO GET (obtener lista de grupos)
export async function getGroups() {
    const response = await apiFetch("/api/permissions/groups/");
    if (!response.ok) await throwApiError(response);
    return response.json();
}

// METODO POST (asignar un permiso a un grupo)
export async function assignGroupPermission(groupId, permissionCodename) {
    const response = await apiFetch(`/api/permissions/groups/${groupId}/assign_permission/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_codename: permissionCodename }),
    });
    if (!response.ok) await throwApiError(response);
    return response.json();
}

// METODO POST (remover un permiso de un grupo)
export async function removeGroupPermission(groupId, permissionCodename) {
    const response = await apiFetch(`/api/permissions/groups/${groupId}/remove_permission/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_codename: permissionCodename }),
    });
    if (!response.ok) await throwApiError(response);
    return response.json();
}
