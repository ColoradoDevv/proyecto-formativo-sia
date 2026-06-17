const API_URL = "http://localhost:4000/api/groups";

export async function getGroupPermissions(groupId) {
    const response = await fetch(`${API_URL}/${groupId}/permissions`);

    if (!response.ok) {
        throw new Error ("Error obteniendo permisos");
    }

    return response.json();
}