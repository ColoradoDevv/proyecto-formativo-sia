import { Button } from "@/shared";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";



// Accesos rapidos a las acciones de creacion mas frecuentes.
// Reutiliza RegisterButton de shared (Link + icono Plus).
const actions = [
    { label: "Registrar Usuario", to: "/usuarios/crear" },
    { label: "Registrar Consumible", to: "/consumibles/crear" },
    { label: "Registrar Devolutivo", to: "/devolutivos/crear" },
    { label: "Registrar Préstamo", to: "/prestamos/crear" },
];

export default function QuickActions() {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-h3 text-text-primary">Accesos rápidos</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => (
                    <Link key={action.to} to={action.to}>
                        <Button
                            icon={Plus}
                            className="w-full justify-center"
                        >
                            {action.label}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
