import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/shared/services/api";

export default function ProtectedRoute() {
    // Si no hay token guardado, lo mandamos al login
    if (!isAuthenticated()) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    // Si hay sesion, renderiza la ruta hija
    return <Outlet />;
}