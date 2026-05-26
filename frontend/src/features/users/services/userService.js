// Este archivo contiene funciones para interactuar con el backend y obtener o enviar datos relacionados con los usuarios.

// METODO GET (obtener lista de usuarios)
export async function getUsers() {
  // enviamos una peticion GET al endpoint /api/users/ para obetner los usuarios registrados
  const response = await fetch("/api/users/");

  // Si la respuesta no es un OK nos arroja un error
  if (!response.ok) {
    throw new Error(
      "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
    );
  }

  // Convertimos la respuesta del servidor desde formato JSON a un objeto de JavaScript
  const data = await response.json();

  // Si todo sale bien, devolvemos los datos obtenidos del servidor
  return data;
}

// METODO GET (obtener un usuario por su ID)
export async function getUserById(id) {
  const response = await fetch(`/api/users/${id}/`);

  if (!response.ok) {
    throw new Error(
      "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
    );
  }
  const data = await response.json();
  return data;
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
    formData.append("role_id", userData.userRole);

    if (userData.userAdditionalPhone)
        formData.append("second_phone_number", userData.userAdditionalPhone);

    if (userData.userInstitutionalEmail)
        formData.append("institutional_email", userData.userInstitutionalEmail);

    if (userData.userProfile?.[0])
        formData.append("profile_picture", userData.userProfile[0]);

    // Enviamos una petición POST al endpoint /api/users/
    // con la información del usuario que queremos registrar
    const response = await fetch("/api/users/", {
        method: "POST",
        body: formData,   // sin headers, sin JSON.stringify
    });

    // Si la respuesta no es un OK, lanzamos un error
    if (!response.ok) {
        throw new Error(
        "¡Houston, tenemos un problema! El servidor se fue a tomar café.",
        );
    }

    // Convertimos la respuesta del servidor desde formato JSON
    // a un objeto de JavaScript
    const data = await response.json();

    // Si todo sale bien, devolvemos los datos del usuario creado
    return data;
}
