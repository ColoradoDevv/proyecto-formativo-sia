import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, StatusBadge, showAlert, cancelAlert } from "@/shared";
import { Undo2, Pencil, ImageOff } from "lucide-react";
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

    // Crea una marca nueva, la agrega a las opciones y la devuelve al form.
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
    const navigate      = useNavigate();
    const photoInputRef = useRef();

    const [photoPreview, setPhotoPreview] = useState(CM.image ?? null);
    const [photoFile,    setPhotoFile]    = useState(null);

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

            // Si se ingresa placa SENA, la cantidad siempre es 1 y no es editable
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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
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

        try {
            await updateCm(id, { ...formData, photo: photoFile });
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Material de consumo actualizado exitosamente" });
            navigate(-1);
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar material de consumo", text: error.message });
        }
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    const isActive = CM.is_active;

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
                        <>
                            <div className="relative">
                                <div className="size-24 rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                                    {photoPreview
                                        ? <img src={photoPreview} alt={formData.name} className="w-full h-full object-cover" />
                                        : <ImageOff size={40} className="text-text-muted" />
                                    }
                                </div>
                                <button
                                    type="button"
                                    aria-label="Cambiar foto del material"
                                    onClick={() => photoInputRef.current.click()}
                                    className="absolute bottom-2 right-2 size-7 bg-brand text-text-inverse rounded-[var(--radius-full)] flex items-center justify-center shadow-[var(--shadow-elevation-1)] hover:opacity-90 transition-opacity"
                                >
                                    <Pencil size={13} />
                                </button>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    hidden
                                    accept=".jpg,.jpeg,.png,.svg"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                            <StatusBadge active={isActive} />
                        </>
                    }
                />

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
