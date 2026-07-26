import { apiFetch, throwApiError } from "@/shared/services/api";

const FIELD_MAP = {
    id_responsable_user: "loanResponsableUser",
    id_receptor_user: "loanReceptorUser",
    id_material: "loanMaterial",
    amount_lent: "loanMaterialQuantities",
    apprentice_group: "loanGroup",
    justification_use: "loanJustification",
    return_date: "loanReturnDate",
};

export async function getLoans() {
    const response = await apiFetch("/api/loans/");
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function getLoanById(id) {
    const response = await apiFetch(`/api/loans/${id}/`);
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function createLoan(loanData) {
    const response = await apiFetch("/api/loans/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_responsable_user: loanData.loanResponsableUser,
            id_receptor_user: loanData.loanReceptorUser,
            id_material: loanData.loanMaterial,
            amount_lent: loanData.loanMaterialQuantities,
            apprentice_group: loanData.loanGroup,
            justification_use: loanData.loanJustification,
            return_date: loanData.loanReturnDate,
        }),
    });

    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function updateLoan(id, loanData) {
    const response = await apiFetch(`/api/loans/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_responsable_user: loanData.loanResponsableUser,
            id_receptor_user: loanData.loanReceptorUser,
            id_material: loanData.loanMaterial,
            amount_lent: loanData.loanAmount,
            apprentice_group: loanData.loanGroup,
            justification_use: loanData.loanJustification,
            return_date: loanData.loanReturnDate,
        }),
    });

    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

export async function deleteLoan(id) {
    const response = await apiFetch(`/api/loans/${id}/`, {
        method: "DELETE",
    });
    if (!response.ok) await throwApiError(response, FIELD_MAP);
}

// METODO POST - firma el préstamo usando el token recibido por correo.
// El endpoint es público: no requiere sesión activa.
export async function signLoan(token) {
    const response = await fetch("/api/loans/sign/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.error || "No se pudo procesar la firma.");
        error.status = response.status;
        throw error;
    }

    return response.json();
}
