import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
    isAuthenticated,
    getToken,
    getStoredPermissions,
    setStoredPermissions,
} from "@/shared/services/api";

//
// Guard de rutas privadas.
// Además de verificar el token, re-hidrata los permisos desde el backend
// si sessionStorage no los tiene (sesión iniciada antes del feature de permisos
// o pestaña recargada con token válido pero sin sia_permissions).
//

export default function ProtectedRoute() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Si no hay token no hay nada que hidratar; el render de abajo redirige.
        if (!isAuthenticated()) {
            setReady(true);
            return;
        }

        // Si ya hay permisos en storage no hacemos fetch innecesario.
        const stored = getStoredPermissions();
        if (stored && stored.length > 0) {
            setReady(true);
            return;
        }

        // Permisos ausentes → fetch silencioso al backend.
        const token = getToken();
        fetch("/api/permissions/permissions/my_permission_codes/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : { permissions: [] }))
            .then((data) => {
                // setStoredPermissions ya dispara sia:permissions-updated,
                // lo que hace que usePermissions se re-renderice en todos los componentes.
                setStoredPermissions(data.permissions ?? []);
            })
            .catch(() => setStoredPermissions([]))
            .finally(() => setReady(true));
    }, []);

    // Mientras se re-hidrata no renderizamos nada para evitar un flash
    // donde el sidebar aparece vacío y luego se llena.
    if (!ready) return null;

    if (!isAuthenticated()) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    return <Outlet />;
}
