// Hacemos una funcion asincrona
export async function getUsers() {
    // enviamos una peticion GET al endpoint /api/users/ para obetner los usuarios registrados
    const response = await fetch('/api/users/');

    // Si la respuesta no es un OK nos arroja un error
    if (!response.ok){
        throw new Error('¡Houston, tenemos un problema! El servidor se fue a tomar café.')
    }
    
    // Convertimos la respuesta del servidor desde formato JSON a un objeto de JavaScript
    const data = await response.json();
    
    // Si todo sale bien, devolvemos los datos obtenidos del servidor
    return data
}