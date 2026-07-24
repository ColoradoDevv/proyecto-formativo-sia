import { useEffect, useState } from "react";
import { getLoans } from "@/features/loans/services/loanService";

// Trae los prestamos y devuelve los mas recientes para el panel de inicio.
// Si limit es 0 (usuario sin permiso) no hace ningún fetch.
function useRecentLoans(limit = 5) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(limit > 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        // No hacer fetch si no hay permiso (limit === 0)
        if (limit === 0) {
            setLoading(false);
            setLoans([]);
            return;
        }

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
