import { apiFetch, throwApiError } from "@/shared/services/api";

// Mapeo de campos del backend a las keys del formulario. Crear y editar usan
// la misma convencion de nombres, compartida por ReturnableForm.
const FIELD_MAP = {
    name: "name",
    sena_plate: "senaPlate",
    state: "state",
    brand_id: "brand",
    category_id: "category",
    serial: "serial",
    unit_price: "unitPrice",
    total_price: "totalPrice",
    description: "description",
    purchase_date: "purchaseDate",
    quantity: "quantity",
    location: "location",
    image: "photo",
    technical_sheet: "technicalSheet",
};

export async function getRMs() {
    const response = await apiFetch("/api/products/returnables/");
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function getRMById(id) {
    const response = await apiFetch(`/api/products/returnables/${id}/`);
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function createRM(rmData) {
    const formData = new FormData();

    formData.append("name", rmData.name);
    formData.append("sena_plate", rmData.senaPlate);
    formData.append("state", rmData.state);
    formData.append("brand_id", rmData.brand);
    formData.append("category_id", rmData.category);
    formData.append("serial", rmData.serial);
    formData.append("unit_price", rmData.unitPrice);
    formData.append("total_price", rmData.totalPrice);
    formData.append("description", rmData.description);
    formData.append("purchase_date", rmData.purchaseDate);

    if (rmData.quantity)    formData.append("quantity", rmData.quantity);
    if (rmData.location)    formData.append("location", rmData.location);
    if (rmData.photo?.[0])  formData.append("image", rmData.photo[0]);
    if (rmData.technicalSheet?.[0]) formData.append("technical_sheet", rmData.technicalSheet[0]);
    
    // Concatenar dimensiones si existen (formato: "30x50x20")
    if (rmData.width || rmData.length || rmData.depth) {
        const dimensions = `${rmData.width || ""}x${rmData.length || ""}x${rmData.depth || ""}`;
        formData.append("dimensions", dimensions);
    }

    const response = await apiFetch("/api/products/returnables/", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

// METODO PATCH (editar un material devolutivo existente).
export async function updateRM(id, rmData) {
    const formData = new FormData();

    formData.append("name", rmData.name);
    formData.append("sena_plate", rmData.senaPlate);
    formData.append("state", rmData.state);
    formData.append("brand_id", rmData.brand);
    formData.append("category_id", rmData.category);
    formData.append("serial", rmData.serial);
    formData.append("unit_price", rmData.unitPrice);
    formData.append("total_price", rmData.totalPrice);
    formData.append("description", rmData.description);
    formData.append("purchase_date", rmData.purchaseDate);
    formData.append("quantity", rmData.quantity);

    if (rmData.location) formData.append("location", rmData.location);
    if (rmData.photo?.[0]) formData.append("image", rmData.photo[0]);
    if (rmData.technicalSheet?.[0]) formData.append("technical_sheet", rmData.technicalSheet[0]);    
    // Concatenar dimensiones si existen (formato: "30x50x20")
    if (rmData.width || rmData.length || rmData.depth) {
        const dimensions = `${rmData.width || ""}x${rmData.length || ""}x${rmData.depth || ""}`;
        formData.append("dimensions", dimensions);
    }
    const response = await apiFetch(`/api/products/returnables/${id}/`, {
        method: "PATCH",
        body: formData,
    });

    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

// El toggle de is_active va contra el ConsumableMaterial (donde vive el campo)
export async function toggleRMActive(consumableId, isActive) {
    const response = await apiFetch(`/api/products/consumables/${consumableId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
    });
    if (!response.ok) await throwApiError(response);
    return response.json();
}
