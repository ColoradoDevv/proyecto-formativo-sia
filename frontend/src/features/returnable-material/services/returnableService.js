import { apiFetch, throwApiError } from "@/shared/services/api";

const FIELD_MAP = {
    name: "rmName",
    sena_plate: "rmSenaPlate",
    state: "rmState",
    brand_id: "rmBrand",
    category_id: "rmCategory",
    serial: "rmSerial",
    unit_price: "rmUnitValue",
    total_price: "rmTotalValue",
    description: "rmDescription",
    purchase_date: "rmPurchaseDate",
    quantity: "rmQuantity",
    location: "rmLocation",
    image: "rmPhoto",
    technical_sheet: "rmTechnicalSheet",
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

    formData.append("name", rmData.rmName);
    formData.append("sena_plate", rmData.rmSenaPlate);
    formData.append("state", rmData.rmState);
    formData.append("brand_id", rmData.rmBrand);
    formData.append("category_id", rmData.rmCategory);
    formData.append("serial", rmData.rmSerial);
    formData.append("unit_price", rmData.rmUnitValue);
    formData.append("total_price", rmData.rmTotalValue);
    formData.append("description", rmData.rmDescription);
    formData.append("purchase_date", rmData.rmPurchaseDate);

    if (rmData.rmQuantity)    formData.append("quantity", rmData.rmQuantity);
    if (rmData.rmLocation)    formData.append("location", rmData.rmLocation);
    if (rmData.rmPhoto?.[0])  formData.append("image", rmData.rmPhoto[0]);
    if (rmData.rmTechnicalSheet?.[0]) formData.append("technical_sheet", rmData.rmTechnicalSheet[0]);

    const response = await apiFetch("/api/products/returnables/", {
        method: "POST",
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
