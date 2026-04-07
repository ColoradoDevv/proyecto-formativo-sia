import {Input, Button} from "@/shared";

export default function RmRegisterForm(){

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
                    <form className="grid grid-cols-2 items-center gap-42">
                        {/* Inputs */}
                        <div className="grid grid-cols-1 items-right gap-4 my-0 mx-auto ">
                            <Input 
                                label = "Placa Sena"
                                placeholder = "Ingrese la Placa Sena"
                            />      
                            <Input 
                                label = "Nombre"
                                placeholder = "Ingrese nombre del Material"
                            />
                            <Input 
                                label = "Estado"
                                placeholder = "Ingrese estado del Material"
                                
                            />
                            <Input 
                                label = "Categoria"
                                placeholder = "Ingrese la categoria del Material"
                                
                            />
                            <Input 
                                label = "Marca"
                                placeholder = "Ingrese la Marca del Material"
                                
                            />
                        </div>

                        <div className="grid grid-cols-1 items-right gap-4 my-0 mx-auto ">
                        
                            <Input 
                                label = "Serial"
                                placeholder = "Ingrese el Serial del Material"
                            />
                        
                            <Input 
                                label = "Cantidad"
                                placeholder = "Ingrese la cantidad del Material"
                            />
                        
                            <Input 
                                label = "Valor Unitario"
                                placeholder = "Ingrese el valor Unitario del Material"
                                
                            />


                            <Input 
                                label = "Valor Total"
                                placeholder = "Ingrese el valor Total del Material"
                                
                            />


                            <Input 
                                label = "Ficha Tecnica (Opcional)"
                                placeholder = "Ingrese la Ficha Tecnica del Material"
                                
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
                    </form>

            <div className='grid grid-cols-1 justify-items-center'>
                    {/* Botones */}
                    <div    >

                        <div className="grid grid-cols-2 gap-6">             
                            <Button
                                variant="primary"
                                size="md"
                            >
                                Crear
                            </Button>

                            <Button
                                variant="secondary"
                                size="md2"
                            >
                                Cancelar
                            </Button>
                                            
                        </div>
                    </div>
            </div>
                
        </div>
    )
}