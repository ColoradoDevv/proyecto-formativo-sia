import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, showAlert, cancelAlert } from "@/shared";
import { brandSchema } from "../../schemas/brandSchema";
import { createBrand } from "../../services/brandService";

export default function TmRegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ brandName: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

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
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Marca registrada exitosamente" });
            navigate("/marcas");
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al registrar la marca", text: error.message });
        }
    }

    return (
        <>
            <div className="flex flex-col p-4 sm:p-6">
                <div className="mb-4 w-full">
                    <h1 className="text-h3">Registro de Marcas</h1>
                    <p className="text-small text-text-muted">
                        Registra una nueva marca para asociarla a los materiales.
                    </p>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 w-full max-w-sm"
                >
                    <Input
                        label="Nombre de la marca"
                        name="brandName"
                        placeholder="Ej: Asus, HP, Dell"
                        value={formData.brandName}
                        onChange={handleChange}
                        error={errors.brandName}
                        maxLength={100}
                        required
                    />

                    <div className="flex gap-4 justify-center sm:justify-start">
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md">
                            Crear
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
