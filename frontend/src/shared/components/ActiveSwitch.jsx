import { useState } from "react";
import { Switch, ConfirmCancelModal } from "@/shared";

export default function ActiveSwitch({ id, isActive, toggleFn, entity = "material" }) {
    const [active, setActive] = useState(isActive);
    const [showModal, setShowModal] = useState(false);
    const [pendingValue, setPendingValue] = useState(null);

    const handleChange = (value) => {
        setPendingValue(value);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            await toggleFn(id, pendingValue);
            setActive(pendingValue);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        } finally {
            setShowModal(false);
            setPendingValue(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setPendingValue(null);
    };

    return (
        <>
            <Switch checked={active} onChange={handleChange} className="inline-flex" />
            <ConfirmCancelModal
                isOpen={showModal}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={pendingValue ? `¿Activar ${entity}?` : `¿Desactivar ${entity}?`}
                message={pendingValue
                    ? `El ${entity} volverá a estar disponible en el sistema.`
                    : `El ${entity} no podrá ser usado mientras esté inactivo.`
                }
                confirmText={pendingValue ? "Sí, activar" : "Sí, desactivar"}
                cancelText="Cancelar"
            />
        </>
    );
}