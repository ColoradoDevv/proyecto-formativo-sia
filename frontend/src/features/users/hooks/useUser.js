import { useEffect, useState } from "react";
import { getUserById } from "../services/userService";

function useUser(id) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async() => {
            try {
                setLoading(true); // Reinicia el estado de carga si el efecto se vuelve a ejecutar
                const data = await getUserById(id);
                setUser(data) // Guarda los datos obtenidos
            } catch (err) {
                setError(err) // Captura el error si la API falla
            } finally {
                setLoading(false); // Apaga el indicador de carga 
            }
        };

        fetchUser();
    }, [id]) // Un array con `id` para que se ejecute cuando cambie

    return { user, loading, error}
}

export default useUser;