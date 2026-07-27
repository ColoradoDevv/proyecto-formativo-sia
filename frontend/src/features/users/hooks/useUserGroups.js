import { useEffect, useState } from "react";
import { getUserGroups } from "../services/selectServices";
import { showAlert } from "@/shared";

// Carga los grupos activos disponibles para los selectores de usuario.
export default function useUserGroups() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getUserGroups()
            .then(setGroups)
            .catch((err) =>
                showAlert({
                    icon: "error",
                    iconColor: "var(--color-error)",
                    title: "No se pudieron cargar los grupos de usuario",
                    text: err.message,
                })
            );
    }, []);

    return { groups };
}
