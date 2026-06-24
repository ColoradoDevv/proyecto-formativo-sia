import { apiFetch, throwApiError } from "@/shared/services/api";

// Mapea los nombres de campo que devuelve el backend a las keys del formData
// del formulario de usuarios, para poder mostrar el error junto al input correcto.
const FIELD_MAP = {
    first_name: "userName",
    last_name: "userLastName",
    document_type_id: "userDocumentType",
    document_number: "userDocumentNumber",
    email: "userEmail",
    phone_number: "userPhone",
    second_phone_number: "userAdditionalPhone",
    institutional_email: "userInstitutionalEmail",
    address: "userAddress",
    start_date: "userStartDate",
    end_date: "userEndDate",
};

// METODO GET (obtener lista de usuarios)
export async function getUsers() {
    const response = await apiFetch("/api/users/");
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
}

// METODO GET (obtener un usuario por su ID)
export async function getUserById(id) {
    const response = await apiFetch(`/api/users/${id}/`);
    if (!response.ok) await throwApiError(response, FIELD_MAP);
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

    if (!response.ok) await throwApiError(response, FIELD_MAP);
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
  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO GET (obtener grupos de un usuario)
export async function getUserGroups(userId) {
  const response = await apiFetch(`/api/permissions/users/${userId}/groups/`);
  if (!response.ok) await throwApiError(response, FIELD_MAP);
  return response.json();
}

// METODO POST (asignar un grupo a un usuario)
export async function assignUserGroups(userId, groupIds) {
  // groupIds es un array de IDs de grupos
  // Necesitamos hacer un POST por cada grupo
  const assignments = groupIds.map(async (groupId) => {
    // Primero obtenemos el nombre del grupo
    const groupResponse = await apiFetch(`/api/permissions/groups/${groupId}/`);
    if (!groupResponse.ok) await throwApiError(groupResponse);
    const group = await groupResponse.json();

    // Luego asignamos el usuario al grupo
    const response = await apiFetch(`/api/permissions/users/${userId}/groups/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: group.name }),
    });
    if (!response.ok) await throwApiError(response, FIELD_MAP);
    return response.json();
  });

  return Promise.all(assignments);
}

// METODO DELETE (remover un usuario de un grupo)
export async function removeUserFromGroup(userId, groupId) {
  // Obtenemos el nombre del grupo
  const groupResponse = await apiFetch(`/api/permissions/groups/${groupId}/`);
  if (!groupResponse.ok) await throwApiError(groupResponse);
  const group = await groupResponse.json();

  // Removemos el usuario del grupo
  const response = await apiFetch(`/api/permissions/users/${userId}/groups/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ group_name: group.name }),
  });
  if (!response.ok) await throwApiError(response, FIELD_MAP);
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
