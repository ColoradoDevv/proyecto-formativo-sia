import { useNavigate, useParams } from "react-router-dom";
import { Undo2, CloudAlert } from "lucide-react";
import { Button, IconButton, Input, TextArea, StatusBadge, EditCard } from "@/shared";
import useLoan from "../../hooks/useLoan";
import { TailChase } from "ldrs/react";

export default function LoanDetailView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { loan, loading, error } = useLoan(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error)
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-3 bg-text-secondary border border-text-secondary text-text-inverse rounded-lg px-6 py-4 max-w-md">
                    <span className="text-h1"><CloudAlert /></span>
                    <div>
                        <p className="font-heading">Error al cargar el préstamo</p>
                        <p className="text-small">{error.message}</p>
                    </div>
                </div>
            </div>
        );

    if (!loan) return null;

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Visualizar Préstamo</h2>
                    <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">

                {/* Información del Préstamo */}
                <EditCard title="Información del Préstamo" cols={1}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* Campos del prestamo */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                            <Input label="Usuario" value={loan.usuario ?? ""} disabled readOnly />
                            <Input label="Material" value={loan.material ?? ""} disabled readOnly />
                            <Input label="Cantidad" value={loan.amount_lent ?? ""} disabled readOnly />
                            <Input label="Grupo" value={loan.apprentice_group ?? ""} disabled readOnly />
                            <Input label="Fecha Préstamo" value={loan.loan_date ?? ""} disabled readOnly />
                            <Input label="Fecha Devolución" value={loan.return_date ?? ""} disabled readOnly />
                            <div className="sm:col-span-2">
                                <TextArea label="Justificación de Uso" value={loan.justification_use ?? ""} disabled readOnly />
                            </div>
                        </div>

                    </div>
                </EditCard>

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button variant="secondary" size="md" onClick={() => navigate("/prestamos")}>
                        Volver al listado
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate(`/prestamos/editar/${loan.id_loan}`)}>
                        Editar
                    </Button>
                </div>

            </div>

        </div>
    );
}
