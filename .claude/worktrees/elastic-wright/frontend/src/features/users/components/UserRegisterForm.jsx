import {Input, Button} from "@/shared";

export default function UserRegisterForm(){

    // Handle

    const handleNameChange = (e) => {
        console.log("Nombre: ", e.target.value)
    }

    const handleEmailBlur = (e) => {
        console.log("Email: ", e.target.value)
    }

    return (
        <div>
            <h1 className="text-2xl mb-6">
                Registro de Usuarios
            </h1>
            <form className="grid grid-cols-1 items-center gap-6">
                {/* Inputs */}
                <div className="grid grid-cols-3 gap-4 my-0 mx-auto">
                    <Input 
                        label = "Nombre"
                        placeholder = "Ingrese su nombre"
                        onChange={handleNameChange}
                    />
                    <Input 
                        label = "Nombre"
                        placeholder = "Ingrese su nombre"
                    />
                    <Input 
                        label = "Nombre"
                        placeholder = "Ingrese su nombre"
                    />
                    <Input 
                        label = "Nombre"
                        placeholder = "Ingrese su nombre"
                    />
                    <Input 
                        label = "Nombre"
                        placeholder = "Ingrese su nombre"
                    />

                    <Input 
                        label = "Edad"
                        placeholder = "Ingrese su edad"
                        type="number"
                    />

                    <Input 
                        label = "Teléfono"
                        placeholder = "Ingrese su teléfono"
                        type="tel"
                    />

                    <Input 
                        label = "Contraseña"
                        placeholder = "Ingrese su contraseña"
                        type="password"
                    />

                    <Input 
                        label = "Correo"
                        placeholder = "Ingrese su correo"
                        type="email"
                        onBlur={handleEmailBlur}
                    />

                        {/* Actions */}
                    <div className="flex items-center justify-start gap-6">                
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

            </form>
        </div>
    )
}