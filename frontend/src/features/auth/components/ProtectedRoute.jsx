import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
    isAuthenticated,
    getToken,
    getStoredPermissions,
    setStoredPermissions,
} from "@/shared/services/api";

//
// Guard de rutas privadas.
// Si no hay sesión redirige a /iniciar-sesion preservando la URL actual
// en ?next= para que LoginForm pueda volver allí tras el login exitoso.
// Además re-hidrata los permisos desde el backend si sessionStorage no
// los tiene (pestaña recargada con token válido pero sin sia_permissions).
//

export default function ProtectedRoute() {
    const [ready, setReady] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated()) {
            setReady(true);
            return;
        }

        const stored = getStoredPermissions();
        if (stored && stored.length > 0) {
            setReady(true);
            return;
        }

        const token = getToken();
        fetch("/api/permissions/permissions/my_permission_codes/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : { permissions: [] }))
            .then((data) => {
                setStoredPermissions(data.permissions ?? []);
            })
            .catch(() => setStoredPermissions([]))
            .finally(() => setReady(true));
    }, []);

    if (!ready) return null;

    if (!isAuthenticated()) {
        // Preservar la URL completa (pathname + search) como ?next=
        // para que LoginForm redirija de vuelta después del login.
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/iniciar-sesion?next=${next}`} replace />;
    }

    return <Outlet />;
}
