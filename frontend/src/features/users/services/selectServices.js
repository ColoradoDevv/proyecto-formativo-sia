import { apiFetch } from "@/shared/services/api";

export async function getDocumentTypes(){
    const response = await apiFetch("/api/users/document-types/");

    if (!response.ok) {
        throw new Error(
        "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
        );
    }

    // Convertimos la respuesta del servidor desde formato JSON a un objeto de JavaScript
    const data = await response.json();

    // Si todo sale bien, devolvemos los datos obtenidos del servidor
    return data.map((item) => ({
        id: item.id,
        label: item.name,
    }));
}

export async function getUserRoles(){
    const response = await apiFetch("/api/users/roles/");

    if (!response.ok) {
        throw new Error(
        "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
        );
    }

    // Convertimos la respuesta del servidor desde formato JSON a un objeto de JavaScript
    const data = await response.json();

    // Si todo sale bien, devolvemos los datos obtenidos del servidor
    return data.map((item) => ({
        id: item.id,
        label: item.name,
    }));

}

export async function getUserGroups(){
    const response = await apiFetch("/api/permissions/groups/");

    if (!response.ok) {
        throw new Error(
        "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
        );
    }

    // Convertimos la respuesta del servidor desde formato JSON a un objeto de JavaScript
    const data = await response.json();

    // Si todo sale bien, devolvemos los datos obtenidos del servidor
    return data.map((item) => ({
        id: item.id,
        label: item.name,
    }));

}