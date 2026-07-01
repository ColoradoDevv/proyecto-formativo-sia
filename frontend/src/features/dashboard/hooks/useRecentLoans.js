import { useEffect, useState } from "react";
import { getLoans } from "@/features/loans/services/loanService";

// Trae los prestamos y devuelve los mas recientes para el panel de inicio.
// Mismo contrato { data, loading, error } que el resto de hooks del proyecto.
function useRecentLoans(limit = 5) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setLoading(true);
                const data = await getLoans();
                // Ordenar por fecha de prestamo (mas reciente primero) y recortar.
                const recent = [...data]
                    .sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date))
                    .slice(0, limit);
                setLoans(recent);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [limit]);

    return { loans, loading, error };
}

export default useRecentLoans;
