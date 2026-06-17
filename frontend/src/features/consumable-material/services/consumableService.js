// Handlers
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



// METODO GET (obtener lista de products)
export async function getCM() {
  const response = await apiFetch("/api/products/consumables/");
  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO GET (obtener un products por su ID)
export async function getCMById(id) {
  const response = await apiFetch(`/api/products/consumables/${id}/`);
  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO POST (crear un nuevo products)
export async function createCm(cmData) {
  const formData = new FormData();

  formData.append("name", cmData.cmName);
  formData.append("description", cmData.cmDescription);
  formData.append("brand_id", cmData.cmBrand);
  formData.append("user_id", cmData.cmUser);
  formData.append("state", cmData.cmState);
  formData.append("unit_price", cmData.cmUnitValue);
  formData.append("total_price", cmData.cmTotalValue);
  formData.append("purchase_date", cmData.cmPurchaseDate);
  formData.append("is_active", "true");

  if (cmData.cmSenaPlate)
    formData.append("sena_plate", cmData.cmSenaPlate);
  if (cmData.cmQuantity)
    formData.append("quantity", cmData.cmQuantity);
  if (cmData.cmLocation)
    formData.append("location", cmData.cmLocation);
  if (cmData.cmPhoto?.[0])
    formData.append("image", cmData.cmPhoto[0]);

  const response = await apiFetch("/api/products/consumables/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO PATCH (activar o desactivar un material)
export async function toggleCmActive(id, isActive) {
  const response = await apiFetch(`/api/products/consumables/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!response.ok) handleHttpError(response);
  return response.json();
}
