import { Button } from "@/shared";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Accesos rapidos a las acciones de creacion mas frecuentes.
// Cada acción solo se muestra si el usuario tiene al menos uno de los permisos listados.
const ALL_ACTIONS = [
    {
        label: "Registrar Usuario",
        to: "/usuarios/crear",
        requiredPerms: ["create_user"],
    },
    {
        label: "Registrar Consumible",
        to: "/consumibles/crear",
        // Codenames reales en BD (migración 0002) + codenames nuevos (migración 0004)
        requiredPerms: ["create_consumable_material", "create_consumable"],
    },
    {
        label: "Registrar Devolutivo",
        to: "/devolutivos/crear",
        requiredPerms: ["create_returnable_material", "create_returnable"],
    },
    {
        label: "Registrar Préstamo",
        to: "/prestamos/crear",
        requiredPerms: ["create_loan"],
    },
];

export default function QuickActions() {
    const { canAny } = usePermissions();

    const visibleActions = ALL_ACTIONS.filter(({ requiredPerms }) =>
        canAny(requiredPerms)
    );

    // No renderizar la sección si el usuario no tiene ninguna acción disponible
    if (visibleActions.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-h3 text-text-primary">Accesos rápidos</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleActions.map((action) => (
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
