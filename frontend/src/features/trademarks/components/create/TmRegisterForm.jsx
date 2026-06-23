import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, ConfirmCancelModal, successAlert, errorAlert } from "@/shared";
import { brandSchema } from "../../schemas/brandSchema";
import { createBrand } from "../../services/brandService";

export default function TmRegisterForm() {
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [formData, setFormData] = useState({ brandName: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const result = brandSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            await createBrand(result.data);
            await successAlert({ title: "Marca registrada exitosamente" });
            navigate("/marcas");
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            errorAlert({ title: "Error al registrar la marca", text: error.message });
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 my-2 mx-2 sm:mx-4 justify-items-center p-2 sm:p-4">
                <div className="grid gap-2 justify-items-left mb-4 w-full">
                    <h1 className="text-h3">Registro de Marcas</h1>
                    <p className="text-sm text-text-muted">
                        Registra una nueva marca para asociarla a los materiales.
                    </p>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-6 mt-4 w-full max-w-sm"
                >
                    <Input
                        label="Nombre de la marca"
                        name="brandName"
                        placeholder="Ej: Asus, HP, Dell"
                        value={formData.brandName}
                        onChange={handleChange}
                        error={errors.brandName}
                        required
                    />

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => setShowCancelModal(true)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md">
                            Crear
                        </Button>
                    </div>
                </form>
            </div>

            <ConfirmCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => navigate(-1)}
            />
        </>
    );
}
