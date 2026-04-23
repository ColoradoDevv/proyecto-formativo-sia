import { useState, useEffect } from "react";

import { getBrands, getStates, getCategory} from "../../returnable-material/services/selectServices";

import {Input, Button, SelectInput} from "@/shared";
import { rmSchema } from "../schemas/rmSchema";

export default function RmRegisterForm(){

    const [category, setCategory] = useState([]);
    const [brands, setBrands] = useState([]);
    const [states, setStates] = useState([]);
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
        rmTechnicalSheet: "",
    });
    const [errors, setErrors] = useState({});

    useEffect (() => {
        getCategory().then(setCategory)
    }, []);


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

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = rmSchema.safeParse(formData);

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
        console.log("Material devolutivo validado", result.data);
    };


    return (
        <div className="grid grid-cols-1 my-4 mx-4 justify-items-center gap-8 p-4">

            <div className="grid grid-cols-3 justify-items-left">
                    {/* Titulos */}
                    <div className='grid gap-2 justify-items-left'>
                        <h1 className="text-xl  font-bold">
                            Crear Material Devolutivo
                        </h1>

                        <h1 className="text-sm ">
                            Aca podras crear un material devolutivo con los datos correspondientes
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
                        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-4">
                            <Input 
                                label = "Placa Sena"
                                name="rmSenaPlate"
                                placeholder = "Ingrese la Placa Sena"
                                value={formData.rmSenaPlate}
                                onChange={handleChange}
                                error={errors.rmSenaPlate}
                                required
                            />      
                            <Input 
                                label = "Nombre"
                                name="rmName"
                                placeholder = "Ingrese nombre del Material"
                                value={formData.rmName}
                                onChange={handleChange}
                                error={errors.rmName}
                                required
                            />

                            <SelectInput 
                                label = "Estado"
                                name="rmState"
                                options={states}
                                value={formData.rmState}
                                onChange={handleChange}
                                error={errors.rmState}
                                required
                            />

                            <SelectInput 
                                label = "Categoria"
                                name="rmCategory"
                                options={category}
                                value={formData.rmCategory}
                                onChange={handleChange}
                                error={errors.rmCategory}
                                required
                            />

                            <SelectInput
                                label = "Marca"
                                name="rmBrand"
                                options={brands}
                                value={formData.rmBrand}
                                onChange={handleChange}
                                error={errors.rmBrand}
                                required
                            />
                        
                            <Input 
                                label = "Serial"
                                name="rmSerial"
                                placeholder = "Ingrese el Serial del Material"
                                value={formData.rmSerial}
                                onChange={handleChange}
                                error={errors.rmSerial}
                                required
                            />
                        
                            <Input 
                                label = "Cantidad"
                                name="rmQuantity"
                                type="number"
                                placeholder = "Ingrese la cantidad del Material"
                                min="1"
                                step="1"
                                value={formData.rmQuantity}
                                onChange={handleChange}
                                error={errors.rmQuantity}
                                required
                            />
                        
                            <Input 
                                label = "Valor Unitario"
                                name="rmUnitValue"
                                type="number"
                                placeholder = "Ingrese el valor Unitario del Material"
                                min="0"
                                step="0.01"
                                value={formData.rmUnitValue}
                                onChange={handleChange}
                                error={errors.rmUnitValue}
                                required
                            />


                            <Input 
                                label = "Valor Total"
                                name="rmTotalValue"
                                type="number"
                                placeholder = "Ingrese el valor Total del Material"
                                min="0"
                                step="0.01"
                                value={formData.rmTotalValue}
                                onChange={handleChange}
                                error={errors.rmTotalValue}
                                required
                            />


                            <Input 
                                label = "Ficha Tecnica (Opcional)"
                                name="rmTechnicalSheet"
                                placeholder = "Ingrese la Ficha Tecnica del Material"
                                value={formData.rmTechnicalSheet}
                                onChange={handleChange}
                                error={errors.rmTechnicalSheet}
                            />        
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
                        <div className="flex gap-6">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                            >
                                Crear
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                size="md2"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                
        </div>
    )
}
