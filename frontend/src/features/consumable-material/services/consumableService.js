// Handlers
import { apiFetch, throwApiError } from "@/shared/services/api";

// Mapeos de campos del backend a las keys de formData usadas en cada formulario.
const CREATE_FIELD_MAP = {
  name: "cmName",
  description: "cmDescription",
  brand_id: "cmBrand",
  user_id: "cmUser",
  state: "cmState",
  unit_price: "cmUnitValue",
  total_price: "cmTotalValue",
  purchase_date: "cmPurchaseDate",
  sena_plate: "cmSenaPlate",
  quantity: "cmQuantity",
  location: "cmLocation",
  image: "cmPhoto",
};

const EDIT_FIELD_MAP = {
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
};

// METODO GET (obtener lista de products)
export async function getCM() {
  const response = await apiFetch("/api/products/consumables/");
  if (!response.ok) await throwApiError(response, CREATE_FIELD_MAP);
  return response.json();
}

// METODO GET (obtener un products por su ID)
export async function getCMById(id) {
  const response = await apiFetch(`/api/products/consumables/${id}/`);
  if (!response.ok) await throwApiError(response, CREATE_FIELD_MAP);
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

  if (!response.ok) await throwApiError(response, CREATE_FIELD_MAP);
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

  const response = await apiFetch(`/api/products/consumables/${id}/`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) await throwApiError(response, EDIT_FIELD_MAP);
  return response.json();
}

// METODO PATCH (activar o desactivar un material)
export async function toggleCmActive(id, isActive) {
  const response = await apiFetch(`/api/products/consumables/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!response.ok) await throwApiError(response);
  return response.json();
}
