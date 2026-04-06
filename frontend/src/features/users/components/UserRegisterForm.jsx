import {Input, Button} from "@/shared";
//import logo from './logo.png'; // Tell webpack this JS file uses this image


export default function UserRegisterForm(){

    return (
        <div className="grid grid-cols-1 my-10 mx-10 justify-items-start gap-8">

                <h1 className="text-xl font-bold">
                    Registro de Usuarios
                </h1>

                <h1 className="text-sm font-bold">
                    Aca podras registrar a un usuario con los datos correspondientes
                </h1>    

                {/* Formulario */}
                <form className="grid grid-cols-3 items-center gap-48">
                    {/* Inputs */}
                    <div className="grid grid-cols-1 items-right gap-8 my-0 mx-auto ">
                    <Input 
                            label = "Nombres Completos"
                            placeholder = "Ingrese su nombre"
                        />      
                        <Input 
                            label = "Tipo de Documento"
                            placeholder = "Ingrese su nombre"
                        />
                        <Input 
                            label = "Correo"
                            placeholder = "Ingrese su correo"
                            type="email"
                        />
                        <Input 
                            label = "Contraseña"
                            placeholder = "Ingrese su contraseña"
                            type="password"
                        />
                        <Input 
                            label = "Fecha de inicio"
                            placeholder = "Fecha de inicio"
                            type="number"
                        />
                    </div>

                    <div className="grid grid-cols-1 items-right gap-8 my-0 mx-auto ">
                    
                        <Input 
                            label = "Apellidos Completos"
                            placeholder = "Ingrese su nombre"
                        />
                    
                        <Input 
                            label = "Numero de documento"
                            placeholder = "Ingrese su nombre"
                        />
                    
                        <Input 
                            label = "Confirmar Correo"
                            placeholder = "Confirmar correo electronico"
                            type="email"
                        />


                        <Input 
                            label = "Confirmar Contraseña"
                            placeholder = "Confirmar contraseña"
                            type="password"
                        />


                        <Input 
                            label = "Fecha de Finalización"
                            placeholder = "Ingrese fecha de finalización"
                            type="number"
                        />        
                    </div>
                    {/* Fotografia */}
                    <div className='flex flex-col gap-4'>
                        <h1 className="text-sm font-bold">
                            Subir fotografia
                        </h1>  
                        <div className="grid justify-items-center w-64 h-64 border-4 rounded-xl border-white gap-6">
                            
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
                        variant="primary"
                        size="sm"
                        >
                        Subir
                        </Button>
                        <Button
                        variant="primary"
                        size="sm"
                        >
                        Elegir otra
                        </Button>
                    </div>
                </form>

                {/* Botones */}
                <div className='grid grid-rows-1 justify-end'>

                    <div className="grid grid-cols-2 gap-6">             
                        <Button
                            variant="primary"
                            size="md"
                        >
                            Guardar
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                        >
                            Cancelar
                        </Button>
                                        
                    </div>
                </div>
                
        </div>


    )
}