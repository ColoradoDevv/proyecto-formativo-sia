import { apiFetch } from "@/shared/services/api";

export async function getUsers() {
    const response = await apiFetch("/api/users/");
    const data = await response.json();
    return data.map((user) => ({ id: user.id, label: `${user.first_name} ${user.last_name}` }));
}

export async function getMaterials() {
    const response = await apiFetch("/api/products/consumables/");
    const data = await response.json();
    return data.map((material) => ({
        id: material.id,
        label: material.available_quantity != null
            ? `${material.name} (${material.available_quantity} disponibles)`
            : material.name,
        available_quantity: material.available_quantity,
    }));
}