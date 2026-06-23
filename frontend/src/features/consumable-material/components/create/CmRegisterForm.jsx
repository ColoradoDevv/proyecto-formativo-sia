import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getBrands, getUsers } from "../../services/selectServices";

import {Input, FileInput, Button, SelectInput, TextArea, showAlert, cancelAlert} from "@/shared";
import { cmSchema } from "../../schemas/cmSchema";
import {createCm} from "../../services/consumableService";


export default function CmRegisterForm(){

        const navigate = useNavigate();
        const [brands, setBrands] = useState([]);
        const [errors, setErrors] = useState({});
        const [users, setUsers] = useState([]);
        const [formData, setFormData] = useState({
            cmName: "",
            cmDescription: "",
            cmSenaPlate: "",
            cmQuantity: "",
            cmLocation: "",
            cmBrand: "",
            cmState: "Disponible",
            cmUnitValue: "",
            cmTotalValue: "",
            cmUser: "",
            cmPurchaseDate: new Date().toISOString().split('T')[0],            
            cmPhoto: [],
        });

        useEffect (() => {
            getBrands().then(setBrands);
        }, []);
        
        useEffect (() => {
            getUsers().then(setUsers);
        }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => {
                const updated = { ...prev, [name]: value };

                // Si se ingresa placa SENA, la cantidad siempre es 1 y no es editable
                if (name === "cmSenaPlate") {
                    updated.cmQuantity = value.trim() !== "" ? "1" : "";
                }

                // Calcular total automáticamente
                const quantity  = name === "cmQuantity"  ? value : updated.cmQuantity;
                const unitValue = name === "cmUnitValue" ? value : updated.cmUnitValue;

                if (quantity && unitValue) {
                    const total = (parseFloat(quantity) * parseFloat(unitValue)).toFixed(2);
                    updated.cmTotalValue = isNaN(total) ? "" : total;
                }

                return updated;
            });
        };

        const hasSenaPlate = formData.cmSenaPlate.trim() !== "";

        const handleFileChange = (name) => (files) => {
            setFormData({ ...formData, [name]: files });
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
        };

    return (
        <>
        <div className="grid grid-cols-1 my-2 mx-4 justify-items-center p-4">

            <div className="grid grid-cols-3 justify-items-left">
                    {/* Titulos */}
                    <div className='grid gap-2 justify-items-left'>
                        <h1 className="text-h2">
                            Crear Material de Consumo
                        </h1>

                        <h1 className="text-small text-text-muted">
                            Aca podras crear un material consumible con los datos correspondientes
                        </h1>    
                    </div>
            </div>

                    {/* Formulario */}
                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center gap-6"
                    >
                        {/* Inputs */}
                        <div className="flex gap-8 items-start">
                            <div className="grid grid-cols-2 items-center gap-x-8 gap-y-4">

                                <Input
                                    label = "Nombre"
                                    name="cmName"
                                    placeholder = "Ingrese el nombre del Material"
                                    value={formData.cmName}
                                    onChange={handleChange}
                                    error={errors.cmName}
                                    required
                                />


                                <Input
                                    label = "Placa Sena (Opcional)"
                                    name="cmSenaPlate"
                                    placeholder = "Ingrese la Placa Sena del Material"
                                    value={formData.cmSenaPlate}
                                    onChange={handleChange}
                                    error={errors.cmSenaPlate}
                                    
                                />

                                <TextArea
                                    label = "Descripcion"
                                    name="cmDescription"
                                    placeholder = "Ingrese la descripcion del Material"
                                    value={formData.cmDescription}
                                    onChange={handleChange}
                                    error={errors.cmDescription}
                                    required
                                />

                                <Input
                                    label = "Cantidad"
                                    name="cmQuantity"
                                    type="number"
                                    placeholder = "Ingrese la cantidad del Material"
                                    min="1"
                                    step="1"
                                    value={formData.cmQuantity}
                                    onChange={handleChange}
                                    error={errors.cmQuantity}
                                    disabled={hasSenaPlate}
                                    required
                                    hint={hasSenaPlate ? "La cantidad es 1 porque el material tiene placa SENA, no es editable." : undefined}
                                />

                                <SelectInput
                                    label = "Marca"
                                    name="cmBrand"
                                    options={brands}
                                    value={formData.cmBrand}
                                    onChange={handleChange}
                                    error={errors.cmBrand}
                                    required
                                />

                                <Input
                                    label = "Valor Unitario"
                                    name="cmUnitValue"
                                    type="number"
                                    placeholder = "Ingrese el valor Unitario del Material"
                                    min="0"
                                    step="0.01"
                                    value={formData.cmUnitValue}
                                    onChange={handleChange}
                                    error={errors.cmUnitValue}
                                    required
                                />
                                <SelectInput
                                    label = "Cuentadante"
                                    name="cmUser"
                                    options={users}
                                    value={formData.cmUser}
                                    onChange={handleChange}
                                    error={errors.cmUser}
                                    required
                                />
                                <Input
                                    label = "Ubicacion (Opcional)"
                                    name="cmLocation"
                                    placeholder = "Ingrese la ubicacion del Material"
                                    value={formData.cmLocation}
                                    onChange={handleChange}
                                    error={errors.cmLocation}
                                />

                                

                            </div>

                            <div className="flex flex-col gap-4">
                                <FileInput
                                    label="Foto del Material"
                                    name="cmPhoto"
                                    placeholder="Subir foto"
                                    value={formData.cmPhoto}
                                    onChange={handleFileChange("cmPhoto")}
                                    error={errors.cmPhoto}
                                    accept="image/*"
                                    required
                                    className="w-[var(--size-field-sm)] h-[var(--size-preview-md)]"

                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant="secondary" size="md" onClick={handleCancel}>Cancelar</Button>
                            <Button type="submit"  variant="primary"   size="md">Crear</Button>
                        </div>
                    </form>

        </div>
        </>
    )
}
