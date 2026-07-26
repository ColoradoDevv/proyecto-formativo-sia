import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, StatusBadge, showAlert, cancelAlert } from "@/shared";
import { Undo2, Pencil, ImageOff } from "lucide-react";
import useRm from "../../hooks/useRm";
import { getBrands, getCategories, getStates, createBrand } from "../../services/selectServices";
import { rmEditSchema } from "../../schemas/rmSchema";
import { updateRM } from "../../services/returnableService";
import ReturnableForm from "../ReturnableForm";
import { getReturnableCategoryOptions } from "../../utils/returnableCategoryRules";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

// Componente externo: maneja el fetch, loading y error
export default function RmEditView() {
    const { id } = useParams();
    const { RM, loading, error } = useRm(id);

    const [categories, setCategories] = useState([]);
    const [brands,     setBrands]     = useState([]);
    const [states,     setStates]     = useState([]);

    useEffect(() => { getCategories().then(setCategories); }, []);
    useEffect(() => { getBrands().then(setBrands);         }, []);
    useEffect(() => { getStates().then(setStates);         }, []);

    // Crea una marca nueva, la agrega a las opciones y la devuelve al formulario.
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

    return <RmEditForm RM={RM} categories={categories} brands={brands} states={states} onCreateBrand={handleCreateBrand} />;
}

// Componente interno: recibe RM ya cargado e inicializa el estado directamente
function RmEditForm({ RM, categories, brands, states, onCreateBrand }) {
    const navigate      = useNavigate();
    const photoInputRef = useRef();

    const [photoPreview, setPhotoPreview] = useState(RM.image ?? null);
    const [photoFile,    setPhotoFile]    = useState(null);
    const [submitting,   setSubmitting]   = useState(false);

    // Parsear dimensiones si existen (ej: "30x50x20" → {width: "30", length: "50", depth: "20"})
    const parseDimensions = (dimensionsString) => {
        if (!dimensionsString) return { width: "", length: "", depth: "" };
        const parts = String(dimensionsString).split("x");
        return {
            width: parts[0] ?? "",
            length: parts[1] ?? "",
            depth: parts[2] ?? "",
        };
    };

    const dimensions = parseDimensions(RM.dimensions);

    const [formData, setFormData] = useState({
        name:         RM.name ?? "",
        model:        RM.model ?? "",
        senaPlate:    RM.sena_plate ?? "",
        serial:       RM.serial ?? "",
        category:     RM.category?.id != null ? String(RM.category.id) : "",
        brand:        RM.brand?.id != null ? String(RM.brand.id) : "",
        description:  RM.description ?? "",
        state:        RM.state ?? "",
        quantity:     RM.quantity != null ? String(RM.quantity) : "",
        location:     RM.location ?? "",
        unitPrice:    RM.unit_price != null ? String(RM.unit_price) : "",
        totalPrice:   RM.total_price != null ? String(RM.total_price) : "",
        purchaseDate: RM.purchase_date ?? "",
        width: dimensions.width,
        length: dimensions.length,
        depth: dimensions.depth,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
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

        const selectedCategory = categories.find((option) => String(option.id) === String(formData.category));
        const payload = { ...formData, categoryName: selectedCategory?.label ?? selectedCategory?.name ?? "" };
        const result = rmEditSchema.safeParse(payload);

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
            await updateRM(RM.consumable_id, { ...formData, photo: photoFile ? [photoFile] : null });
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Material devolutivo actualizado exitosamente" });
            navigate(-1);
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar material devolutivo", text: error.message });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    const isActive = RM.is_active;

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Editar Material Devolutivo</h2>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                <ReturnableForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    categories={getReturnableCategoryOptions(categories)}
                    brands={brands}
                    states={states}
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
