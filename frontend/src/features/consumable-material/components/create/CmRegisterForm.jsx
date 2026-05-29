import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getBrands, getStates, getUsers } from "../../services/selectServices";

import {Input, FileInput, Button, SelectInput, ConfirmCancelModal} from "@/shared";
import { cmSchema } from "../../schemas/cmSchema";
import {createCm} from "../../services/consumableService";
import Alert from '@mui/material/Alert';


export default function CmRegisterForm(){

        const navigate = useNavigate();
        const [showCancelModal, setShowCancelModal] = useState(false);
        const [brands, setBrands] = useState([]);
        const [states, setStates] = useState([]);
        const [notification, setNotification] = useState(null);
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
            getStates().then(setStates);
        }, []);

        useEffect (() => {
            getUsers().then(setUsers);
        }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => {
                const updated = { ...prev, [name]: value };

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

        const handleFileChange = (name) => (files) => {
            setFormData({ ...formData, [name]: files });
        };

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

                setNotification({ message: "Material de consumo creado exitosamente", severity: "success" });
                setTimeout(() => navigate("/consumibles"), 1500);

            } catch (error) {
                console.error("Error al crear material de consumo:", error);
                setNotification({ message: "Error al crear material de consumo: " + error.message, severity: "error" });
            }
        };

    return (
        <>
        <div className="grid grid-cols-1 my-2 mx-4 justify-items-center p-4">

            <div className="grid grid-cols-3 justify-items-left">
                    {/* Titulos */}
                    <div className='grid gap-2 justify-items-left'>
                        <h1 className="text-xl">
                            Crear Material de Consumo
                        </h1>

                        <h1 className="text-sm text-text-muted">
                            Aca podras crear un material consumible con los datos correspondientes
                        </h1>    
                    </div>
            </div>

                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}

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
                                    label = "Descripcion"
                                    name="cmDescription"
                                    placeholder = "Ingrese la descripcion del Material"
                                    value={formData.cmDescription}
                                    onChange={handleChange}
                                    error={errors.cmDescription}
                                    required
                                />

                                <Input
                                    label = "Placa Sena"
                                    name="cmSenaPlate"
                                    placeholder = "Ingrese la Placa Sena del Material"
                                    value={formData.cmSenaPlate}
                                    onChange={handleChange}
                                    error={errors.cmSenaPlate}
                                    
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
                                    
                                />

                                <Input
                                    label = "Ubicacion"
                                    name="cmLocation"
                                    placeholder = "Ingrese la ubicacion del Material"
                                    value={formData.cmLocation}
                                    onChange={handleChange}
                                    error={errors.cmLocation}
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
                                    label = "Estado"
                                    name="cmState"
                                    options={states}
                                    value={formData.cmState}
                                    onChange={handleChange}
                                    error={errors.cmState}
                                    required
                                />


                                <Input
                                    label = "Valor Total"
                                    name="cmTotalValue"
                                    type="number"
                                    placeholder = "Ingrese el valor Total del Material"
                                    min="0"
                                    step="0.01"
                                    value={formData.cmTotalValue}
                                    onChange={handleChange}
                                    error={errors.cmTotalValue}
                                    required
                                    readOnly
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

                            </div>

                            <div className="flex flex-col gap-4">
                                                                <Input
                                    label="Fecha de Compra"
                                    name="cmPurchaseDate"
                                    type="date"
                                    value={formData.cmPurchaseDate}
                                    onChange={handleChange}
                                    error={errors.cmPurchaseDate}
                                    required
                                />
                                <FileInput
                                    label="Foto del Material"
                                    name="cmPhoto"
                                    placeholder="Subir foto"
                                    value={formData.cmPhoto}
                                    onChange={handleFileChange("cmPhoto")}
                                    error={errors.cmPhoto}
                                    accept="image/*"
                                    className="w-64 h-48"

                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>Cancelar</Button>
                            <Button type="submit"  variant="primary"   size="md">Crear</Button>
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
