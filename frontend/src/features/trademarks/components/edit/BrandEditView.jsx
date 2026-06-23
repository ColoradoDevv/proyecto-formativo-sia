import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, ConfirmCancelModal } from "@/shared";
import { Undo2 } from "lucide-react";
import { TailChase } from "ldrs/react";
import useBrand from "../../hooks/useBrand";
import { brandSchema } from "../../schemas/brandSchema";
import { updateBrand } from "../../services/brandService";
import Alert from "@mui/material/Alert";

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
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [formData, setFormData] = useState({ brandName: brand.name ?? "" });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

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
            await updateBrand(brand.id, result.data);
            setNotification({ message: "Marca actualizada exitosamente", severity: "success" });
            setTimeout(() => navigate("/marcas"), 1500);
        } catch (error) {
            setNotification({ message: error.message, severity: "error" });
        }
    }

    return (
        <>
            <div className="h-full p-6 text-text-primary flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <IconButton onClick={() => navigate(-1)} variant="ghost">
                        <Undo2 />
                    </IconButton>
                    <div>
                        <h2 className="text-h3">Editar Marca</h2>
                        <p className="text-small text-text-muted">Modifica el nombre de la marca.</p>
                    </div>
                </div>

                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}

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
                            Guardar cambios
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
