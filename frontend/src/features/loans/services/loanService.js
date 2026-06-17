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

export async function getLoans() {
    const response = await apiFetch("/api/loans/");
    if (!response.ok) handleHttpError(response);
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

    if (!response.ok) handleHttpError(response);
    return response.json();
}
