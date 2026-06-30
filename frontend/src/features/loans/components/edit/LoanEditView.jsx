import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, TextArea, StatusBadge, cancelAlert, EditCard } from "@/shared";
import { Undo2 } from "lucide-react";
import useLoan from "../../hooks/useLoan";
import { getUsers, getMaterials } from "../../services/selectServices";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

// Componente externo: maneja el fetch, loading y error
export default function LoanEditView() {
    const { id } = useParams();
    const { loan, loading, error } = useLoan(id);

    const [users,     setUsers]     = useState([]);
    const [materials, setMaterials] = useState([]);

    useEffect(() => { getUsers().then(setUsers);         }, []);
    useEffect(() => { getMaterials().then(setMaterials); }, []);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar préstamo: {error.message}</p>;

    return <LoanEditForm loan={loan} users={users} materials={materials} />;
}

// Componente interno: recibe el prestamo ya cargado e inicializa el estado directamente
function LoanEditForm({ loan, users, materials }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loanUser:          loan.id_user     != null ? String(loan.id_user)     : "",
        loanMaterial:      loan.id_material != null ? String(loan.id_material) : "",
        loanAmount:        loan.amount_lent != null ? String(loan.amount_lent) : "",
        loanGroup:         loan.apprentice_group  ?? "",
        loanJustification: loan.justification_use ?? "",
        loanReturnDate:    loan.return_date        ?? "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function handleSubmit(e) {
        e.preventDefault();
        navigate(-1);
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Editar Préstamo</h2>
                    <p className="text-small text-text-muted">Modifica la información del préstamo.</p>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                <EditCard title="Información del Préstamo" cols={1}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* Estado */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <StatusBadge active={loan.is_active} activeLabel="Activo" inactiveLabel="Devuelto" />
                        </div>

                        {/* Campos del prestamo */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                            <SelectInput
                                label="Usuario"
                                name="loanUser"
                                options={users}
                                value={formData.loanUser}
                                onChange={handleChange}
                                required
                            />
                            <SelectInput
                                label="Material"
                                name="loanMaterial"
                                options={materials}
                                value={formData.loanMaterial}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Cantidad Préstamo"
                                name="loanAmount"
                                type="number"
                                min="1"
                                step="1"
                                value={formData.loanAmount}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Grupo"
                                name="loanGroup"
                                value={formData.loanGroup}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Fecha Devolución"
                                name="loanReturnDate"
                                type="date"
                                value={formData.loanReturnDate}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Fecha Préstamo"
                                value={loan.loan_date ?? ""}
                                disabled
                                readOnly
                            />
                            <div className="sm:col-span-2">
                                <TextArea
                                    label="Justificación de Uso"
                                    name="loanJustification"
                                    value={formData.loanJustification}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                    </div>
                </EditCard>

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                        Guardar cambios
                    </Button>
                </div>

            </form>

        </div>
    );
}
