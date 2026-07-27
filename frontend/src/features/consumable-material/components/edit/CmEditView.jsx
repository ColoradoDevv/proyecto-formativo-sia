import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, StatusBadge, showAlert, cancelAlert, FileInput, ProfileFileInput } from "@/shared";
import { Undo2 } from "lucide-react";
import useCm from "../../hooks/useCm";
import { getBrands, getUsers, createBrand } from "../../services/selectServices";
import { updateCm } from "../../services/consumableService";
import { cmEditSchema } from "../../schemas/cmSchema";
import ConsumableForm from "../ConsumableForm";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

// Componente externo: maneja el fetch, loading y error
export default function CmEditView() {
    const { id } = useParams();
    const { CM, loading, error } = useCm(id);

    const [brands, setBrands] = useState([]);
    const [users,  setUsers]  = useState([]);

    useEffect(() => { getBrands().then(setBrands); }, []);
    useEffect(() => { getUsers().then(setUsers);   }, []);

    const handleCreateBrand = async (name) => {
        const option = await createBrand(name);
        setBrands((prev) => [...prev, option]);
        return option;
    };

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar material: {error.message}</p>;

    return <CmEditForm id={id} CM={CM} brands={brands} users={users} onCreateBrand={handleCreateBrand} />;
}

// Componente interno: recibe CM ya cargado e inicializa el estado directamente
function CmEditForm({ id, CM, brands, users, onCreateBrand }) {
    const navigate = useNavigate();

    // Foto: se inicializa con la URL actual para que ProfileFileInput muestre la preview.
    const [photo,          setPhoto]          = useState(CM.image ? [CM.image] : []);
    // Ficha técnica: se inicializa con la URL actual para que FileInput la muestre.
    const [technicalSheet, setTechnicalSheet] = useState(CM.technical_sheet ? [CM.technical_sheet] : []);
    const [submitting,     setSubmitting]     = useState(false);

    const [formData, setFormData] = useState({
        name:         CM.name ?? "",
        description:  CM.description ?? "",
        senaPlate:    CM.sena_plate ?? "",
        quantity:     CM.quantity != null ? String(CM.quantity) : "",
        location:     CM.location ?? "",
        brand:        CM.brand?.id != null ? String(CM.brand.id) : "",
        state:        CM.state ?? "",
        unitPrice:    CM.unit_price != null ? String(CM.unit_price) : "",
        totalPrice:   CM.total_price != null ? String(CM.total_price) : "",
        user:         CM.user?.id != null ? String(CM.user.id) : "",
        purchaseDate: CM.purchase_date ?? "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "senaPlate") {
                updated.quantity = value.trim() !== "" ? "1" : "";
            }

            const quantity  = name === "quantity"  ? value : updated.quantity;
            const unitPrice = name === "unitPrice"  ? value : updated.unitPrice;
            if (quantity && unitPrice) {
                const total = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
                updated.totalPrice = isNaN(total) ? "" : total;
            }
            return updated;
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const result = cmEditSchema.safeParse(formData);

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
            // Solo se envía el archivo si el usuario seleccionó uno nuevo (instanceof File).
            // Si es una URL string (la que ya estaba), no se toca.
            const newPhoto  = photo[0]          instanceof File ? photo[0]          : null;
            const newSheet  = technicalSheet[0] instanceof File ? technicalSheet[0] : null;

            await updateCm(id, { ...formData, photo: newPhoto, technicalSheet: newSheet });
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Material de consumo actualizado exitosamente" });
            navigate(-1);
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar material de consumo", text: error.message });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={handleCancel} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Editar Material de Consumo</h2>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                <ConsumableForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    brands={brands}
                    users={users}
                    onCreateBrand={onCreateBrand}
                    photoSlot={
                        // Mismo layout que CmRegisterForm: foto arriba, ficha abajo.
                        <div className="w-full sm:w-[var(--size-field-sm)] flex flex-col gap-4">
                            <ProfileFileInput
                                label="Foto del Material"
                                name="photo"
                                value={photo}
                                onChange={setPhoto}
                                error={errors.photo}
                                accept="image/*"
                                className="w-full h-25 rounded-2xl"
                                description="Formato JPG o PNG. Tamaño máximo: 2MB."
                            />
                            <StatusBadge active={CM.is_active} />
                            <FileInput
                                label="Ficha Técnica"
                                name="technicalSheet"
                                placeholder="Reemplazar ficha técnica"
                                value={technicalSheet}
                                onChange={setTechnicalSheet}
                                error={errors.technicalSheet}
                                accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/png"
                                multiple={false}
                                maxFiles={1}
                                maxSixeMB={3}
                                className="w-full h-14 rounded-2xl"
                            />
                        </div>
                    }
                />

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md" disabled={submitting}>
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>

            </form>

        </div>
    );
}
