import { useEffect, useState } from "react";
import { getUserGroups, createUserGroup } from "../services/selectServices";

// Carga los grupos disponibles para el SelectMultiple del UserForm y expone
// `addGroup` para crear uno nuevo sin salir del formulario de usuario.
export default function useUserGroups() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getUserGroups().then(setGroups);
    }, []);

    const addGroup = async (name) => {
        const newGroup = await createUserGroup(name);
        setGroups((prev) => [...prev, newGroup]);
        return newGroup;
    };

    return { groups, addGroup };
}
