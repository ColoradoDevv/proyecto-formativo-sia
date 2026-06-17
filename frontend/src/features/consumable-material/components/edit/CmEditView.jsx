import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, ConfirmCancelModal } from "@/shared";
import EditCard from "./EditCard.jsx";
import { Undo2, Pencil, ImageOff } from "lucide-react";
import useCm from "../../hooks/useCm";
import { getBrands, getUsers } from "../../services/selectServices";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

const STATE_OPTIONS = [
    { id: "Disponible",    label: "Disponible"    },
    { id: "No Disponible", label: "No Disponible" },
    { id: "Mantenimiento", label: "Mantenimiento" },
    { id: "Traslado",      label: "Traslado"      },
    { id: "En prestamo",   label: "En prestamo"   },
    { id: "Baja",          label: "Baja"          },
];

// Componente externo: maneja el fetch, loading y error
export default function CmEditView() {
    const { id } = useParams();
    const { CM, loading, error } = useCm(id);

    const [brands, setBrands] = useState([]);
    const [users,  setUsers]  = useState([]);

    useEffect(() => { getBrands().then(setBrands); }, []);
    useEffect(() => { getUsers().then(setUsers);   }, []);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar material: {error.message}</p>;

    return <CmEditForm CM={CM} brands={brands} users={users} />;
}

// Componente interno: recibe CM ya cargado e inicializa el estado directamente
function CmEditForm({ CM, brands, users }) {
    const navigate      = useNavigate();
    const photoInputRef = useRef();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [photoPreview,    setPhotoPreview]    = useState(CM.image ?? null);

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

    const isActive = CM.is_active;

    return (
        <div className="h-full p-4 text-text-primary flex flex-col gap-4">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 />
                </IconButton>
                <div>
                    <h2 className="text-h3">Editar Material de Consumo</h2>
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
                            placeholder="Placa SENA (opcional)"
                            value={formData.senaPlate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-3">
                        <SelectInput
                            label="Marca"
                            name="brand"
                            options={brands}
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                        <SelectInput
                            label="Cuentadante"
                            name="user"
                            options={users}
                            value={formData.user}
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
                        <Input
                            label="Cantidad"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Cantidad"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                        <Input
                            label="Ubicación"
                            name="location"
                            placeholder="Ubicación del material"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <SelectInput
                            label="Estado"
                            name="state"
                            options={STATE_OPTIONS}
                            value={formData.state}
                            onChange={handleChange}
                            required
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
