import AccessCards from "../components/AccessCards"
import { Wrench, Package, ClipboardList, Users } from "lucide-react"

export default function HomeLayout(){
    return (


            <div className="grid grid-col gap-5">

                <h2 className="text-h3">Hola!, Administrador.</h2>
                <p className="text-sm text-text-muted">Bienvenido al Sistema de Gestion Inventario.</p>

                <div className="grid grid-cols-4 gap-4 p-4">
                    
                    <AccessCards
                        Icon={<Wrench />}
                        label="Total artículos registrados"
                        value="1,587"
                    />
                    <AccessCards
                        Icon={<Package />}
                        label="Materiales consumibles"
                        value="320"
                    />
                    <AccessCards
                        Icon={<ClipboardList />}
                        label="Préstamos activos"
                        value="45"
                    />
                    <AccessCards
                        Icon={<Users />}
                        label="Usuarios registrados"
                        value="28"
                    />
                </div>
            </div>
    
    )
}