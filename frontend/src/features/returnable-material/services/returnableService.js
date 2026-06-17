import { apiFetch } from "@/shared/services/api";

const HTTP_ERROR_MESSAGES = {
    400: "400 Solicitud inválida. Verifica los datos enviados.",
    401: "401 No autenticado. Por favor, inicia sesión.",
    403: "403 No tienes permisos para realizar esta acción.",
    404: "404 El recurso solicitado no fue encontrado.",
    409: "409 Conflicto: ya existe un registro con esos datos.",
    422: "422 Los datos enviados no son procesables por el servidor.",
    429: "429 Demasiadas solicitudes. Espera un momento e intenta de nuevo.",
    500: "500 Error interno del servidor. Intenta más tarde.",
    502: "502 El servidor no está disponible (Bad Gateway).",
    503: "503 Servicio temporalmente no disponible. Intenta más tarde.",
};

function handleHttpError(response) {
    const message =
        HTTP_ERROR_MESSAGES[response.status] ??
        `Error inesperado del servidor (código ${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
}

export async function getRMs() {
    const response = await apiFetch("/api/products/returnables/");
    if (!response.ok) handleHttpError(response);
    return response.json();
}

export async function getRMById(id) {
    const response = await apiFetch(`/api/products/returnables/${id}/`);
    if (!response.ok) handleHttpError(response);
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

    if (!response.ok) handleHttpError(response);
    return response.json();
}

// El toggle de is_active va contra el ConsumableMaterial (donde vive el campo)
export async function toggleRMActive(consumableId, isActive) {
    const response = await apiFetch(`/api/products/consumables/${consumableId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
    });
    if (!response.ok) handleHttpError(response);
    return response.json();
}
