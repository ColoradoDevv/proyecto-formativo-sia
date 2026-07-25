import { useEffect, useState, useCallback } from "react";
import { getUsers } from "../services/userService";

function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true); // Reinicia el estado de carga si el efecto se vuelve a ejecutar
            const data = await getUsers();
            setUsers(data); // Guarda los datos obtenidos
            setError(null);
        } catch (err) {
            setError(err); // Captura el error si la API falla
        } finally {
            setLoading(false); // Apaga el indicador de carga
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Se ejecuta al montar el componente

    // refetch permite volver a pedir los datos manualmente
    // (por ejemplo, despues de eliminar un usuario)
    return { users, loading, error, refetch: fetchUsers };
}

export default useUsers;