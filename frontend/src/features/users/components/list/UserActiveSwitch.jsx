import {promptAlert, ActiveSwitch} from "@/shared";

import { toggleUserActive } from "@/features/users/services/userService"; 


export default function UserActiveSwitch({ user }) {
    const requestDeactivationReason = async (nextIsActive) => {
        if (nextIsActive) return undefined;

        const result = await promptAlert({
            icon: "warning",
            iconColor: "var(--color-warning)",
            title: "Motivo de inactivación",
            text: "Indique el motivo para deshabilitar esta cuenta de usuario.",
            inputLabel: "Motivo de inactivación",
            inputPlaceholder: "Describa el motivo de la inactivación",
            confirmText: "Deshabilitar",
            cancelText: "Cancelar",
            inputValidator: (value) => value.trim().length < 10
                ? "El motivo debe tener al menos 10 caracteres."
                : "",
        });

        return result.isConfirmed
            ? { deactivationReason: result.value.trim() }
            : false;
    };

    return (
        <ActiveSwitch
            id={user.id}
            isActive={user.is_active}
            toggleFn={toggleUserActive}
            entity="usuario"
            beforeToggle={requestDeactivationReason}
        />
    );
}