import { useEffect, useState } from "react";
import { getCM } from "../services/consumableService";

function useCMs() {
    const [CMs, setCMs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCMs = async() => {
            try {
                setLoading(true); // Reinicia el estado de carga si el efecto se vuelve a ejecutar
                const data = await getCM();
                setCMs(data) // Guarda los datos obtenidos
            } catch (err) {
                setError(err) // Captura el error si la API falla
            } finally {
                setLoading(false); // Apaga el indicador de carga 
            }
        };

        fetchCMs();
    }, []) // Un array vacio para que solo se ejecute al montar el componente 

    return { CMs, loading, error}
}

export default useCMs;