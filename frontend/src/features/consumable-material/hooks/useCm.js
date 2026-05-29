import { useEffect, useState } from "react";
import { getCMById } from "../services/consumableService";

function useCm(id) {
    const [CM, setCM] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCMs = async() => {
            try {
                setLoading(true); // Reinicia el estado de carga si el efecto se vuelve a ejecutar
                const data = await getCMById(id);
                setCM(data) // Guarda los datos obtenidos
            } catch (err) {
                setError(err) // Captura el error si la API falla
            } finally {
                setLoading(false); // Apaga el indicador de carga 
            }
        };

        fetchCMs();
    }, [id]) // Un array con `id` para que se ejecute cuando cambie

    return { CM, loading, error}
}

export default useCm;