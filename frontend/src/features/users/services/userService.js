import { apiFetch } from "@/shared/services/api";

// Utilidad para menejar errores HTTP de manera consistente en los servicios de usuario
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

// METODO GET (obtener lista de usuarios)
export async function getUsers() {
    const response = await apiFetch("/api/users/");
    if (!response.ok) handleHttpError(response);
    return response.json();
}

// METODO GET (obtener un usuario por su ID)
export async function getUserById(id) {
    const response = await apiFetch(`/api/users/${id}/`);
    if (!response.ok) handleHttpError(response);
    return response.json();
}

// METODO POST (crear un nuevo usuario)
export async function createUser(userData) {
    const formData = new FormData();

    formData.append("first_name", userData.userName);
    formData.append("last_name", userData.userLastName);
    formData.append("document_type_id", userData.userDocumentType);
    formData.append("document_number", userData.userDocumentNumber);
    formData.append("email", userData.userEmail);
    formData.append("phone_number", userData.userPhone);
    formData.append("address", userData.userAddress);
    formData.append("start_date", userData.userStartDate);
    formData.append("end_date", userData.userEndDate);

    if (userData.userAdditionalPhone)
        formData.append("second_phone_number", userData.userAdditionalPhone);

    if (userData.userInstitutionalEmail)
        formData.append("institutional_email", userData.userInstitutionalEmail);

    if (userData.userProfile?.[0])
        formData.append("profile_picture", userData.userProfile[0]);

    const response = await apiFetch("/api/users/", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) handleHttpError(response);
    const user = await response.json();

    // Si se especificaron grupos, asignarlos al usuario recién creado
    if (userData.userGroups && userData.userGroups.length > 0) {
        await assignUserGroups(user.id, userData.userGroups);
    }

    return user;
}

// METODO PATCH (activar o desactivar un usuario)
export async function toggleUserActive(id, isActive) {
  const response = await apiFetch(`/api/users/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: isActive }),
  });
  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO GET (obtener grupos de un usuario)
export async function getUserGroups(userId) {
  const response = await apiFetch(`/api/users/${userId}/groups/`);
  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO POST (asignar un grupo a un usuario)
export async function assignUserGroups(userId, groupIds) {
  // groupIds es un array de IDs de grupos
  // Necesitamos hacer un POST por cada grupo
  const assignments = groupIds.map(async (groupId) => {
    // Primero obtenemos el nombre del grupo
    const groupResponse = await apiFetch(`/api/permissions/groups/${groupId}/`);
    if (!groupResponse.ok) handleHttpError(groupResponse);
    const group = await groupResponse.json();

    // Luego asignamos el usuario al grupo
    const response = await apiFetch(`/api/users/${userId}/groups/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: group.name }),
    });
    if (!response.ok) handleHttpError(response);
    return response.json();
  });

  return Promise.all(assignments);
}

// METODO DELETE (remover un usuario de un grupo)
export async function removeUserFromGroup(userId, groupId) {
  // Obtenemos el nombre del grupo
  const groupResponse = await apiFetch(`/api/permissions/groups/${groupId}/`);
  if (!groupResponse.ok) handleHttpError(groupResponse);
  const group = await groupResponse.json();

  // Removemos el usuario del grupo
  const response = await apiFetch(`/api/users/${userId}/groups/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ group_name: group.name }),
  });
  if (!response.ok) handleHttpError(response);
  return response.json();
}

// METODO PUT (actualizar grupos de un usuario - reemplaza todos)
export async function updateUserGroups(userId, groupIds) {
  // Primero obtenemos los grupos actuales
  const currentGroups = await getUserGroups(userId);
  const currentGroupIds = currentGroups.map(g => g.id);

  // Removemos los grupos que ya no están en la lista
  const toRemove = currentGroupIds.filter(id => !groupIds.includes(id));
  for (const groupId of toRemove) {
    await removeUserFromGroup(userId, groupId);
  }

  // Agregamos los grupos nuevos
  const toAdd = groupIds.filter(id => !currentGroupIds.includes(id));
  if (toAdd.length > 0) {
    await assignUserGroups(userId, toAdd);
  }
}
