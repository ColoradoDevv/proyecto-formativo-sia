import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, showAlert, cancelAlert, IconButton } from "@/shared";
import  loanSchema  from "../../schemas/loanSchema";
import { createLoan } from "../../services/loanService";
import { getUsers, getMaterials } from "../../services/selectServices";
import LoanForm from "../LoanForm";
import { Undo2 } from "lucide-react";


export default function LoanRegisterForm() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        loanResponsableUser: "",
        loanReceptorUser: "",
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

        const schema = loanSchema(materials);
        const result = schema.safeParse(formData);

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
            <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <IconButton onClick={() => navigate(-1)} variant="ghost">
                        <Undo2 size={20}/>
                    </IconButton>
                    <h2 className="text-primary">Crear Préstamo</h2>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 w-full"
                >
                    <LoanForm
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        users={users}
                        materials={materials}
                    />

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