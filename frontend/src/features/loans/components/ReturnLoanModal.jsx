import { useState, useEffect } from "react";
import { Input, TextArea, Button, Modal, showAlert } from "@/shared";
import { buildReturnSchema } from "../schemas/returnSchema";
import { returnLoan } from "../services/returnService";

// Modal para devolver un préstamo.
// - Devolutivo: solo observaciones (el material vuelve al inventario).
// - Consumo: cantidad sobrante (obligatoria) + observaciones.
// Al confirmar, finaliza el préstamo y actualiza el inventario (backend).
export default function ReturnLoanModal({ isOpen, onClose, loan, onReturned }) {
    const [formData, setFormData] = useState({ leftoverQuantity: "", returnedQuantity: "", observations: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Limpia el formulario cada vez que se abre.
    useEffect(() => {
        if (isOpen) {
            setFormData({ leftoverQuantity: "", returnedQuantity: "", observations: "" });
            setErrors({});
        }
    }, [isOpen]);

    if (!loan) return null;

    const isConsumo = loan.material_type === "consumo";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const schema = buildReturnSchema({
            materialType: loan.material_type,
            amountLent: loan.amount_lent,
        });
        const result = schema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            await returnLoan({
                loanId: loan.id_loan,
                leftoverQuantity: isConsumo ? result.data.leftoverQuantity : undefined,
                returnedQuantity: isConsumo ? undefined : result.data.returnedQuantity,
                observations: result.data.observations,
            });
            // En devolutivos, avisar si la devolución quedó incompleta.
            const incomplete =
                !isConsumo && Number(result.data.returnedQuantity) < loan.amount_lent;
            await showAlert({
                icon: incomplete ? "warning" : "success",
                iconColor: incomplete ? "var(--color-error)" : "var(--color-success)",
                title: isConsumo
                    ? "Sobrante registrado y préstamo finalizado"
                    : incomplete
                    ? "Devolución incompleta registrada"
                    : "Material devuelto exitosamente",
                text: incomplete
                    ? `Se devolvieron ${result.data.returnedQuantity} de ${loan.amount_lent}. El préstamo queda como incompleto.`
                    : undefined,
            });
            onReturned?.(loan.id_loan);
            onClose();
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({
                icon: "error",
                iconColor: "var(--color-error)",
                title: "Error al registrar la devolución",
                text: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const footer = (
        <>
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
                Cancelar
            </Button>
            <Button type="submit" form="return-loan-form" variant="primary" size="md" disabled={submitting}>
                {submitting ? "Procesando..." : "Confirmar devolución"}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Devolver Material" footer={footer}>
            <form id="return-loan-form" noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Resumen del préstamo (solo lectura) */}
                <div className="flex flex-col gap-1 rounded-[var(--radius-xl)] border border-border bg-surface-hover px-4 py-3">
                    <p className="text-small text-text-primary">
                        <span className="text-text-muted">Material:</span> {loan.material}
                    </p>
                    <p className="text-small text-text-primary">
                        <span className="text-text-muted">Cantidad prestada:</span> {loan.amount_lent}
                    </p>
                    <p className="text-small text-text-muted">
                        {isConsumo
                            ? "Material de consumo — registra la cantidad sobrante que se reintegra al stock."
                            : "Material devolutivo — indica cuántas unidades se devuelven."}
                    </p>
                </div>

                {isConsumo ? (
                    <Input
                        label="Cantidad sobrante"
                        name="leftoverQuantity"
                        type="number"
                        min="0"
                        step="1"
                        placeholder={`Máximo ${loan.amount_lent}`}
                        value={formData.leftoverQuantity}
                        onChange={handleChange}
                        error={errors.leftoverQuantity}
                        required
                    />
                ) : (
                    <div className="flex flex-col gap-1">
                        <Input
                            label="Cantidad devuelta"
                            name="returnedQuantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder={`Prestadas: ${loan.amount_lent}`}
                            value={formData.returnedQuantity}
                            onChange={handleChange}
                            error={errors.returnedQuantity}
                            required
                        />
                        {/* Aviso en vivo de devolución incompleta */}
                        {formData.returnedQuantity !== "" &&
                            /^\d+$/.test(formData.returnedQuantity) &&
                            Number(formData.returnedQuantity) < loan.amount_lent && (
                                <p className="text-caption text-error">
                                    Devolución incompleta: faltarían{" "}
                                    {loan.amount_lent - Number(formData.returnedQuantity)} unidad(es).
                                </p>
                            )}
                    </div>
                )}

                <TextArea
                    label="Observaciones (opcional)"
                    name="observations"
                    placeholder="Estado en que se devuelve el material…"
                    value={formData.observations}
                    onChange={handleChange}
                    error={errors.observations}
                />
            </form>
        </Modal>
    );
}
