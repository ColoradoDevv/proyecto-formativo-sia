import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands, getUsers, createBrand } from "../../services/selectServices";
import { FileInput, Button, showAlert, cancelAlert, ProfileFileInput, IconButton } from "@/shared";
import { cmSchema } from "../../schemas/cmSchema";
import { createCm } from "../../services/consumableService";
import ConsumableForm from "../ConsumableForm";
import { Undo2 } from "lucide-react";


export default function CmRegisterForm() {

    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    // Convencion de nombres unificada con ConsumableForm y el edit.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        senaPlate: "",
        quantity: "",
        location: "",
        brand: "",
        state: "Disponible",
        unitPrice: "",
        totalPrice: "",
        user: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        photo: [],
    });

    useEffect(() => { getBrands().then(setBrands); }, []);
    useEffect(() => { getUsers().then(setUsers); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Si se ingresa placa SENA, la cantidad siempre es 1 y no es editable
            if (name === "senaPlate") {
                updated.quantity = value.trim() !== "" ? "1" : "";
            }

            // Calcular total automaticamente
            const quantity  = name === "quantity"  ? value : updated.quantity;
            const unitPrice = name === "unitPrice" ? value : updated.unitPrice;
            if (quantity && unitPrice) {
                const total = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
                updated.totalPrice = isNaN(total) ? "" : total;
            }

            return updated;
        });
    };

    const handleFileChange = (name) => (files) => {
        setFormData((prev) => ({ ...prev, [name]: files }));
    };

    // Crea una marca nueva, la agrega a las opciones y la devuelve al form.
    const handleCreateBrand = async (name) => {
        const option = await createBrand(name);
        setBrands((prev) => [...prev, option]);
        return option;
    };

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const result = cmSchema.safeParse(formData);

            if (!result.success) {
                const fieldErrors = {};
                result.error.issues.forEach((issue) => {
                    const field = issue.path[0];
                    fieldErrors[field] = issue.message;
                });
                setErrors(fieldErrors);
                return;
            }

            setErrors({});

            await createCm(result.data);

            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Material de consumo creado exitosamente" });
            navigate("/consumibles");

        } catch (error) {
            console.error("Error al crear material de consumo:", error);
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al crear material de consumo", text: error.message });
        }
    }

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Titulos */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={20}/>
                </IconButton>
                <h2 className="text-primary">Crear Material de Consumo</h2>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                <ConsumableForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    brands={brands}
                    users={users}
                    onCreateBrand={handleCreateBrand}
                    photoSlot={
                        <ProfileFileInput
                            className="w-32 h-40 rounded-[var(--radius-xl)]"
                            value={formData.photo}
                            onChange={handleFileChange("photo")}
                            error={errors.photo}
                            label="Foto del Material"
                            name="photo"
                            required
                            description="Formato JPG o PNG. Tamaño máximo: 2MB."
                        />
                    }
                />

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel}>Cancelar</Button>
                    <Button type="submit" variant="primary" size="md">Crear</Button>
                </div>

            </form>
        </div>
    );
}
