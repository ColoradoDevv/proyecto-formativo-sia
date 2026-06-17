import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Button, ConfirmCancelModal, Input, SelectInputTM, SelectInput } from "@/shared";
import { apiFetch } from "@/shared/services/api";

export default function TmRegisterForm(){
        const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const name = formData.name.trim();
        if (!name) {
            setErrors({ name: "El nombre de la marca es obligatorio" });
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await apiFetch("/api/products/brands/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const message =
                    data.name?.[0] ||
                    data.detail ||
                    "No se pudo registrar la marca";
                throw new Error(message);
            }

            setNotification({ message: "Marca registrada exitosamente", severity: "success" });
            navigate("/configuracion");
        } catch (error) {
            setNotification({ message: error.message, severity: "error" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <>
            <div className="grid grid-cols-1 my-2 mx-2 sm:mx-4 justify-items-center p-2 sm:p-4">
                <div className="grid gap-2 justify-items-left mb-4 w-full">
                    <h1 className="text-h3">Registro de Marcas</h1>
                    <h1 className="text-sm text-text-muted">
                        Registra una nueva marca para asociarla a los materiales.
                    </h1>
                </div>

                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-6 mt-4 w-full max-w-xl"
                >

                <div className="grid grid-cols-2 gap-x-16 w-full">
                        <Input
                            label="Nombre de la marca"
                            name="name"
                            placeholder="Ej: Asus, Hp, Dell"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />

                        <SelectInputTM
                                    label="Categoria"
                                    name="rmState"
                                    // options={states}
                                    value={formData.rmState}
                                    onChange={handleChange}
                                    error={errors.rmState}
                                    required
                                />

                        <SelectInputTM
                                    label="Modulo"
                                    name="rmState"
                                    // options={states}
                                    value={formData.rmState}
                                    onChange={handleChange}
                                    error={errors.rmState}
                                    required
                                />

                        <SelectInputTM
                                    label="Estado"
                                    name="rmState"
                                    // options={states}
                                    value={formData.rmState}
                                    onChange={handleChange}
                                    error={errors.rmState}
                                    required
                                />
                        </div>
                        
                        <div className="grid grid-col justify-items-stretch">
                        <Input
                            label="Uso o descripcion"
                            name="name"
                            placeholder="Ej: Portatiles y equipos de computo"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />
                    </div>



                    <div className="flex gap-4">
                        <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                            {isSubmitting ? "Creando..." : "Crear"}
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
    )
}
