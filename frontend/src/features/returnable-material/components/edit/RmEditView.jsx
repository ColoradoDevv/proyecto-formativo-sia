import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, ConfirmCancelModal } from "@/shared";
import EditCard from "./EditCard.jsx";
import { Undo2, Pencil, ImageOff } from "lucide-react";
import useRm from "../../hooks/useRm";
import { getBrands, getCategories, getStates } from "../../services/selectServices";
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

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar material: {error.message}</p>;

    return <RmEditForm RM={RM} categories={categories} brands={brands} states={states} />;
}

// Componente interno: recibe RM ya cargado e inicializa el estado directamente
function RmEditForm({ RM, categories, brands, states }) {
    const navigate      = useNavigate();
    const photoInputRef = useRef();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [photoPreview,    setPhotoPreview]    = useState(RM.image ?? null);

    const [formData, setFormData] = useState({
        name:         RM.name ?? "",
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
    });

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
        if (file) setPhotoPreview(URL.createObjectURL(file));
    };

    function handleSubmit(e) {
        e.preventDefault();
        navigate(-1);
    }

    const isActive = RM.is_active;

    return (
        <div className="h-full p-4 text-text-primary flex flex-col gap-4">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 />
                </IconButton>
                <div>
                    <h2 className="text-h3">Editar Material Devolutivo</h2>
                    <p className="text-small text-text-muted">Modifica la información del material.</p>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Información General — 3 columnas con foto integrada */}
                <EditCard title="Información General" cols={3}>

                    {/* Col 1 */}
                    <div className="flex flex-col gap-3">
                        <Input
                            label="Nombre"
                            name="name"
                            placeholder="Nombre del material"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Placa SENA"
                            name="senaPlate"
                            placeholder="Placa SENA"
                            value={formData.senaPlate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Serial"
                            name="serial"
                            placeholder="Serial del material"
                            value={formData.serial}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-3">
                        <SelectInput
                            label="Categoría"
                            name="category"
                            options={categories}
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                        <SelectInput
                            label="Marca"
                            name="brand"
                            options={brands}
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Col 3 — foto ocupa fila 1 y 2 */}
                    <div className="row-span-2 flex flex-col items-center justify-center gap-3">
                        <div className="relative">
                            <div className="size-32 rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                                {photoPreview
                                    ? <img src={photoPreview} alt={formData.name} className="w-full h-full object-cover" />
                                    : <ImageOff size={48} className="text-text-muted" />
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
                        <span className={`px-3 py-0.5 rounded-[var(--radius-full)] text-caption font-medium ${isActive ? "bg-success-soft text-success" : "bg-error-soft text-error"}`}>
                            {isActive ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    {/* Descripción — ocupa cols 1 y 2 en fila 2 */}
                    <div className="col-span-2">
                        <Input
                            label="Descripción"
                            name="description"
                            placeholder="Descripción del material"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </EditCard>

                {/* Inventario y Valores lado a lado */}
                <div className="grid grid-cols-2 gap-6 ">

                    <EditCard title="Inventario">
                        <SelectInput
                            label="Estado"
                            name="state"
                            options={states}
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Cantidad"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Cantidad"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Ubicación"
                            name="location"
                            placeholder="Ubicación del material"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <Input
                            label="Fecha de compra"
                            name="purchaseDate"
                            type="date"
                            value={formData.purchaseDate}
                            onChange={handleChange}
                            required
                        />
                    </EditCard>

                    <EditCard title="Valores">
                        <Input
                            label="Valor Unitario"
                            name="unitPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Valor unitario"
                            value={formData.unitPrice}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Valor Total"
                            name="totalPrice"
                            type="number"
                            placeholder="Calculado automáticamente"
                            value={formData.totalPrice}
                            readOnly
                        />
                    </EditCard>

                </div>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                        Guardar cambios
                    </Button>
                </div>

            </form>

            <ConfirmCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => navigate(-1)}
            />

        </div>
    );
}
