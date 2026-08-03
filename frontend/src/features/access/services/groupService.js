import { apiFetch, throwApiError } from "@/shared/services/api";

// METODO GET (obtener lista de grupos)
export async function getGroups() {
    const response = await apiFetch("/api/permissions/groups/");
    if (!response.ok) await throwApiError(response);
    return response.json();
}

export async function createGroup(group) {
    const response = await apiFetch("/api/permissions/groups/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });
    if (!response.ok) await throwApiError(response, { name: "name" });
    return response.json();
}

export async function updateGroup(groupId, group) {
    const response = await apiFetch(`/api/permissions/groups/${groupId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });
    if (!response.ok) await throwApiError(response, { name: "name" });
    return response.json();
}

export async function toggleGroupActive(groupId, isActive, reason) {
    const body = { is_active: isActive };
    if (reason) body.reason = reason;

    const response = await apiFetch(`/api/permissions/groups/${groupId}/toggle_active/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok) await throwApiError(response);
    return response.json();
}

export async function deleteGroup(groupId, deletionReason) {
    const payload = deletionReason ? { deletion_reason: deletionReason } : undefined;

    const response = await apiFetch(`/api/permissions/groups/${groupId}/`, {
        method: "DELETE",
        headers: payload ? { "Content-Type": "application/json" } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!response.ok) await throwApiError(response);
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
