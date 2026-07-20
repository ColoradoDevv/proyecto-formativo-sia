import { useState } from "react";
import { Switch, cancelAlert } from "@/shared";

export default function ActiveSwitch({ id, isActive, toggleFn, entity = "material", size = "md" }) {
    const [active, setActive] = useState(isActive);

    const handleChange = async (value) => {
        const result = await cancelAlert({
            title: value ? `¿Activar ${entity}?` : `¿Desactivar ${entity}?`,
            text: value
                ? `El ${entity} volverá a estar disponible en el sistema.`
                : `El ${entity} no podrá ser usado mientras esté inactivo.`,
            confirmText: value ? "Sí, activar" : "Sí, desactivar",
            cancelText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await toggleFn(id, value);
            setActive(value);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    };

    return <Switch checked={active} onChange={handleChange} size={size} className="inline-flex" />;
}