import { Link } from "react-router-dom";
import { TailChase } from "ldrs/react";
import { CloudAlert, ClipboardList, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/shared";
import useRecentLoans from "../hooks/useRecentLoans";

// Resumen de los ultimos prestamos registrados para el panel de inicio.
// Sigue los mismos estados (loading/error) y estilos que LoansListPage.
export default function RecentActivity() {
    const { loans, loading, error } = useRecentLoans(4);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-h3 text-text-primary">Actividad reciente</h3>
                <Link
                    to="/prestamos"
                    className="inline-flex items-center gap-1 text-small text-text-muted hover:text-text-secondary transition-colors"
                >
                    Ver todos <ArrowRight size={16} />
                </Link>
            </div>

            <div className="bg-surface-hover rounded-2xl shadow-(--shadow-elevation-2) p-2">
                {loading && (
                    <div className="flex items-center justify-center py-10">
                        <TailChase size="32" speed="1.75" color="var(--semantic-text-primary)" />
                    </div>
                )}

                {error && !loading && (
                    <div className="flex items-center gap-3 text-text-secondary px-4 py-6">
                        <span className="text-h2"><CloudAlert /></span>
                        <div>
                            <p className="font-heading">No se pudo cargar la actividad</p>
                            <p className="text-small">{error.message}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && loans.length === 0 && (
                    <div className="flex flex-col items-center gap-2 text-text-muted py-10">
                        <ClipboardList size={28} />
                        <p className="text-small">Aún no hay préstamos registrados.</p>
                    </div>
                )}

                {!loading && !error && loans.length > 0 && (
                    <ul className="flex flex-col">
                        {loans.map((loan) => (
                            <li
                                key={loan.id_loan}
                                className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border last:border-b-0"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-text-secondary shrink-0"><ClipboardList size={18} /></span>
                                    <div className="min-w-0">
                                        <p className="text-medium text-text-primary truncate">
                                            {loan.usuario_responsable} prestó a {loan.usuario_receptor}
                                        </p>
                                        <p className="text-small text-text-muted truncate">
                                            {loan.material} · {loan.amount_lent} und.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-small text-text-muted hidden sm:inline">
                                        {loan.loan_date}
                                    </span>
                                    <StatusBadge
                                        active={loan.is_active}
                                        activeLabel="Prestado"
                                        inactiveLabel="Devuelto"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
