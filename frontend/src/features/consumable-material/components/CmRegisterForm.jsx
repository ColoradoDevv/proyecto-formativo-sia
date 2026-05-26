import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getBrands, getStates } from "../services/selectServices";

import {Input, FileInput, Button, SelectInput, ConfirmCancelModal} from "@/shared";
import { cmSchema } from "../schemas/cmSchema";

export default function CmRegisterForm(){

        const navigate = useNavigate();
        const [showCancelModal, setShowCancelModal] = useState(false);
        const [brands, setBrands] = useState([]);
        const [states, setStates] = useState([]);
        const [formData, setFormData] = useState({
            cmName: "",
            cmDescription: "",
            cmSenaPlate: "",
            cmQuantity: "",
            cmLocation: "",
            cmBrand: "",
            cmState: "",
            cmUnitValue: "",
            cmTotalValue: "",
            cmTechnicalSheet: [],
            cmPhoto: [],
        });
        const [errors, setErrors] = useState({});

        useEffect (() => {
            getBrands().then(setBrands);
        }, []);
        
        useEffect (() => {
            getStates().then(setStates);
        }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const handleFileChange = (name) => (files) => {
            setFormData({ ...formData, [name]: files });
        };

        const handleSubmit = (e) => {
            e.preventDefault();

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
            console.log("Material consumible validado", result.data);
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
                                    required
                                />

                                <Input
                                    label = "Ubicacion"
                                    name="cmLocation"
                                    placeholder = "Ingrese la ubicacion del Material"
                                    value={formData.cmLocation}
                                    onChange={handleChange}
                                    error={errors.cmLocation}
                                    required
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
                                />

                            </div>

                            <div className="flex flex-col gap-4">
                                <FileInput
                                    label="Foto del Producto (Opcional)"
                                    name="cmPhoto"
                                    placeholder="Subir foto"
                                    value={formData.cmPhoto}
                                    onChange={handleFileChange("cmPhoto")}
                                    error={errors.cmPhoto}
                                    accept="image/*"
                                    className="w-64 h-48"
                                />
                                <FileInput
                                    label="Ficha Tecnica (Opcional)"
                                    name="cmTechnicalSheet"
                                    placeholder="Ingrese la Ficha Tecnica del Material"
                                    value={formData.cmTechnicalSheet}
                                    onChange={handleFileChange("cmTechnicalSheet")}
                                    error={errors.cmTechnicalSheet}
                                    accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    className="w-64 h-40"
                                />
                            </div>
                        </div>
                        {/* Fotografia
                            <div className='flex flex-col gap-4'>
                                <h1 className="text-sm font-bold">
                                    Subir fotografia
                                </h1>  
                                <div className="grid justify-items-center w-64 h-64 border-4 rounded-xl border-slate-200 gap-6">
                                    
                                    <div className="relative top-12 right-0">
                                        
                                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" 
                                    /><path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5" 
                                    /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                                    
                                    </div>
                                    <div className="text-xs text-center">
                                        Haga click aqui para subir una fotografia
                                    </div>
                                </div>
                                <Button
                                variant="secondary"
                                size="smm"  
                                >
                                Subir
                                </Button>
                                
                                <Button
                                variant="primary"
                                size="smm"
                                >
                                Elegir otra
                                </Button>
                        </div>
                         */}
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
