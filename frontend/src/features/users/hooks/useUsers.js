import { useEffect, useState } from "react";
import { getUsers } from "../services/api/userService";

function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                setLoading(true); // Reinicia el estado de carga si el efecto se vuelve a ejecutar
                const data = await getUsers();
                setUsers(data) // Guarda los datos obtenidos
            } catch (err) {
                setError(err) // Captura el error si la API falla
            } finally {
                setLoading(false); // Apaga el indicador de carga 
            }
        };

        fetchUsers();
    }, []) // Un array vacio para que solo se ejecute al montar el componente 

    return { users, loading, error}
}

export default useUsers;