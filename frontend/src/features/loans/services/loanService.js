import { apiFetch, throwApiError } from "@/shared/services/api";

const FIELD_MAP = {
    id_user: "loanUser",
    id_material: "loanMaterial",
    amount_lent: "loanAmount",
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
            id_user: loanData.loanUser,
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
