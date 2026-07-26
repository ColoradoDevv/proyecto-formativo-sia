// Handlers
import { apiFetch, throwApiError } from "@/shared/services/api";

// Mapeo de campos del backend a las keys del formulario (crear y editar usan
// la misma convencion de nombres, compartida por ConsumableForm).
const FIELD_MAP = {
  name: "name",
  description: "description",
  brand_id: "brand",
  user_id: "user",
  state: "state",
  unit_price: "unitPrice",
  total_price: "totalPrice",
  purchase_date: "purchaseDate",
  sena_plate: "senaPlate",
  quantity: "quantity",
  location: "location",
  image: "photo",
  technical_sheet: "technicalSheet",
};

// METODO GET (obtener lista de products)
export async function getCM() {
  const response = await apiFetch("/api/products/consumables/");
  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO GET (obtener un products por su ID)
export async function getCMById(id) {
  const response = await apiFetch(`/api/products/consumables/${id}/`);
  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO POST (crear un nuevo products)
export async function createCm(cmData) {
  const formData = new FormData();

  formData.append("name", cmData.name);
  formData.append("description", cmData.description);
  formData.append("brand_id", cmData.brand);
  formData.append("user_id", cmData.user);
  formData.append("state", cmData.state);
  formData.append("unit_price", cmData.unitPrice);
  formData.append("total_price", cmData.totalPrice);
  formData.append("purchase_date", cmData.purchaseDate);
  formData.append("is_active", "true");

  if (cmData.senaPlate)
    formData.append("sena_plate", cmData.senaPlate);
  if (cmData.quantity)
    formData.append("quantity", cmData.quantity);
  if (cmData.location)
    formData.append("location", cmData.location);
  if (cmData.photo?.[0])
    formData.append("image", cmData.photo[0]);
  if (cmData.technicalSheet?.[0])
    formData.append("technical_sheet", cmData.technicalSheet[0]);

  const response = await apiFetch("/api/products/consumables/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO PATCH (editar un products existente)
export async function updateCm(id, cmData) {
  const formData = new FormData();

  formData.append("name", cmData.name);
  formData.append("description", cmData.description);
  formData.append("brand_id", cmData.brand);
  formData.append("user_id", cmData.user);
  formData.append("state", cmData.state);
  formData.append("unit_price", cmData.unitPrice);
  formData.append("total_price", cmData.totalPrice);
  formData.append("purchase_date", cmData.purchaseDate);

  if (cmData.senaPlate)
    formData.append("sena_plate", cmData.senaPlate);
  if (cmData.quantity)
    formData.append("quantity", cmData.quantity);
  if (cmData.location)
    formData.append("location", cmData.location);
  if (cmData.photo)
    formData.append("image", cmData.photo);
  if (cmData.technicalSheet)
    formData.append("technical_sheet", cmData.technicalSheet);

  const response = await apiFetch(`/api/products/consumables/${id}/`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO PATCH (activar o desactivar un material)
export async function toggleCmActive(id, isActive) {
  const response = await apiFetch(`/api/products/consumables/${id}/toggle_active/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!response.ok) await throwApiError(response);
  return response.json();
}

export async function deleteCm(id) {
  const response = await apiFetch(`/api/products/consumables/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) await throwApiError(response);
}

