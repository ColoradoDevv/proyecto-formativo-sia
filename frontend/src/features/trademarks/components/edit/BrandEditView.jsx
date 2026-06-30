import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, showAlert, cancelAlert } from "@/shared";
import { Undo2 } from "lucide-react";
import { TailChase } from "ldrs/react";
import useBrand from "../../hooks/useBrand";
import { brandSchema } from "../../schemas/brandSchema";
import { updateBrand } from "../../services/brandService";

export default function BrandEditView() {
    const { id } = useParams();
    const { brand, loading, error } = useBrand(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error)
        return <p className="text-error text-center p-6">Error al cargar marca: {error.message}</p>;

    return <BrandEditForm brand={brand} />;
}

function BrandEditForm({ brand }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ brandName: brand.name ?? "" });
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
            await updateBrand(brand.id, result.data);
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Marca actualizada exitosamente" });
            navigate("/marcas");
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar la marca", text: error.message });
        }
    }

    return (
        <>
            <div className="h-full p-4 sm:p-6 text-text-primary flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <IconButton onClick={() => navigate(-1)} variant="ghost">
                        <Undo2 size={18}/>
                    </IconButton>
                    <div>
                        <h2 className="text-primary">Editar Marca</h2>
                        <p className="text-small text-text-muted">Modifica el nombre de la marca.</p>
                    </div>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 max-w-sm"
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
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
