import { useEffect, useState } from "react";
import { getUserGroups, createUserGroup } from "../services/selectServices";
import { showAlert } from "@/shared";

// Carga los grupos disponibles para el SelectMultiple del UserForm y expone
// `addGroup` para crear uno nuevo sin salir del formulario de usuario.
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

    const addGroup = async (name) => {
        const newGroup = await createUserGroup(name);
        setGroups((prev) => [...prev, newGroup]);
        return newGroup;
    };

    return { groups, addGroup };
}
