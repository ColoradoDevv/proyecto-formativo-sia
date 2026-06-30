import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, SelectInput, Button, TextArea, showAlert, cancelAlert } from "@/shared";
import { loanSchema } from "../../schemas/loanSchema";
import { createLoan } from "../../services/loanService";
import { getUsers, getMaterials } from "../../services/selectServices";

export default function LoanRegisterForm() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        loanUser: "",
        loanMaterial: "",
        loanAmount: "",
        loanGroup: "",
        loanJustification: "",
        loanReturnDate: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => { getUsers().then(setUsers); }, []);
    useEffect(() => { getMaterials().then(setMaterials); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loanSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            await createLoan(result.data);
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Prestamo creado exitosamente" });
            navigate("/prestamos");
        } catch (err) {
            if (err.fieldErrors) setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al crear el prestamo", text: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col p-4 sm:p-6">
                <div className="mb-4 w-full">
                    <h1 className="text-h2 font-heading">
                        Crear Prestamo
                    </h1>
                    <p className="text-small text-text-muted">
                        Aca podras crear un prestamo con los datos correspondientes
                    </p>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 w-full"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
                        <SelectInput
                            label="Usuario"
                            name="loanUser"
                            options={users}
                            value={formData.loanUser}
                            onChange={handleChange}
                            error={errors.loanUser}
                            required
                        />
                        <SelectInput
                            label="Material"
                            name="loanMaterial"
                            options={materials}
                            value={formData.loanMaterial}
                            onChange={handleChange}
                            error={errors.loanMaterial}
                            required
                        />
                        <Input
                            label="Cantidad Prestamo"
                            name="loanAmount"
                            placeholder="Ingrese la cantidad del prestamo"
                            type="number"
                            min="1"
                            step="1"
                            value={formData.loanAmount}
                            onChange={handleChange}
                            error={errors.loanAmount}
                            required
                        />
                        <Input
                            label="Grupo"
                            name="loanGroup"
                            placeholder="Ingrese su grupo"
                            value={formData.loanGroup}
                            onChange={handleChange}
                            error={errors.loanGroup}
                            required
                        />
                        <Input
                            label="Fecha Devolucion"
                            name="loanReturnDate"
                            type="date"
                            value={formData.loanReturnDate}
                            onChange={handleChange}
                            error={errors.loanReturnDate}
                            required
                        />
                        <div className="sm:col-span-2">
                            <TextArea
                                label="Justificacion de Uso"
                                name="loanJustification"
                                placeholder="Ingrese la justificacion de uso"
                                value={formData.loanJustification}
                                onChange={handleChange}
                                error={errors.loanJustification}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center md:justify-end">
                        <Button type="button" variant="secondary" size="md" onClick={handleCancel}>Cancelar</Button>
                        <Button type="submit" variant="primary" size="md" disabled={submitting}>
                            {submitting ? "Guardando..." : "Crear"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
