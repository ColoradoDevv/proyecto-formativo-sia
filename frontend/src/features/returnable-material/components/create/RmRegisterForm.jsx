import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getBrands, getStates, getCategories } from "../../services/selectServices";
import { createRM } from "../../services/returnableService";

import { Input, FileInput, Button, SelectInput, ConfirmCancelModal } from "@/shared";
import { rmSchema } from "../../schemas/rmSchema";

export default function RmRegisterForm() {
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [states, setStates] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const [formData, setFormData] = useState({
        rmSenaPlate: "",
        rmName: "",
        rmState: "",
        rmCategory: "",
        rmBrand: "",
        rmSerial: "",
        rmQuantity: "",
        rmUnitValue: "",
        rmTotalValue: "",
        rmDescription: "",
        rmPurchaseDate: "",
        rmTechnicalSheet: [],
        rmPhoto: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => { getCategories().then(setCategories); }, []);
    useEffect(() => { getBrands().then(setBrands); }, []);
    useEffect(() => { getStates().then(setStates); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name) => (files) => {
        setFormData({ ...formData, [name]: files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = rmSchema.safeParse(formData);

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
        setServerError(null);

        try {
            await createRM(result.data);
            navigate("/devolutivos");
        } catch (err) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 my-2 mx-4 justify-items-center p-4">
                <div className="grid grid-cols-3 justify-items-left">
                    <div className="grid gap-2 justify-items-left">
                        <h1 className="text-xl">Crear Material Devolutivo</h1>
                        <h1 className="text-sm text-text-muted">
                            Acá podrás crear un material devolutivo con los datos correspondientes
                        </h1>
                    </div>
                </div>

                {serverError && (
                    <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}

                <form noValidate onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                    <div className="flex gap-8 items-start">
                        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-4">
                            <Input
                                label="Placa Sena"
                                name="rmSenaPlate"
                                placeholder="Ingrese la Placa Sena"
                                value={formData.rmSenaPlate}
                                onChange={handleChange}
                                error={errors.rmSenaPlate}
                                required
                            />
                            <Input
                                label="Nombre"
                                name="rmName"
                                placeholder="Ingrese nombre del Material"
                                value={formData.rmName}
                                onChange={handleChange}
                                error={errors.rmName}
                                required
                            />
                            <SelectInput
                                label="Estado"
                                name="rmState"
                                options={states}
                                value={formData.rmState}
                                onChange={handleChange}
                                error={errors.rmState}
                                required
                            />
                            <SelectInput
                                label="Categoría"
                                name="rmCategory"
                                options={categories}
                                value={formData.rmCategory}
                                onChange={handleChange}
                                error={errors.rmCategory}
                                required
                            />
                            <SelectInput
                                label="Marca"
                                name="rmBrand"
                                options={brands}
                                value={formData.rmBrand}
                                onChange={handleChange}
                                error={errors.rmBrand}
                                required
                            />
                            <Input
                                label="Serial"
                                name="rmSerial"
                                placeholder="Ingrese el Serial del Material"
                                value={formData.rmSerial}
                                onChange={handleChange}
                                error={errors.rmSerial}
                                required
                            />
                            <Input
                                label="Cantidad"
                                name="rmQuantity"
                                type="number"
                                placeholder="Ingrese la cantidad"
                                min="1"
                                step="1"
                                value={formData.rmQuantity}
                                onChange={handleChange}
                                error={errors.rmQuantity}
                                required
                            />
                            <Input
                                label="Valor Unitario"
                                name="rmUnitValue"
                                type="number"
                                placeholder="Ingrese el valor unitario"
                                min="0"
                                step="0.01"
                                value={formData.rmUnitValue}
                                onChange={handleChange}
                                error={errors.rmUnitValue}
                                required
                            />
                            <Input
                                label="Valor Total"
                                name="rmTotalValue"
                                type="number"
                                placeholder="Ingrese el valor total"
                                min="0"
                                step="0.01"
                                value={formData.rmTotalValue}
                                onChange={handleChange}
                                error={errors.rmTotalValue}
                                required
                            />
                            <Input
                                label="Fecha de Compra"
                                name="rmPurchaseDate"
                                type="date"
                                value={formData.rmPurchaseDate}
                                onChange={handleChange}
                                error={errors.rmPurchaseDate}
                                required
                            />
                            <Input
                                label="Descripción"
                                name="rmDescription"
                                placeholder="Descripción del material"
                                value={formData.rmDescription}
                                onChange={handleChange}
                                error={errors.rmDescription}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <FileInput
                                label="Foto del Producto (Opcional)"
                                name="rmPhoto"
                                placeholder="Subir foto"
                                value={formData.rmPhoto}
                                onChange={handleFileChange("rmPhoto")}
                                error={errors.rmPhoto}
                                accept="image/*"
                                className="w-64 h-48"
                            />
                            <FileInput
                                label="Ficha Técnica (Opcional)"
                                name="rmTechnicalSheet"
                                placeholder="Ingrese la ficha técnica"
                                value={formData.rmTechnicalSheet}
                                onChange={handleFileChange("rmTechnicalSheet")}
                                error={errors.rmTechnicalSheet}
                                accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                className="w-64 h-40"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md" disabled={submitting}>
                            {submitting ? "Guardando..." : "Crear"}
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
