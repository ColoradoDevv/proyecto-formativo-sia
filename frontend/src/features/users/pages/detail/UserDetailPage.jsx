import { Navigate, useParams } from "react-router-dom";
import { getStoredUser } from "@/shared/services/api";
import { usePermissions } from "@/shared";
import UserDetailView from "../../components/detail/UserDetailView";

export default function UserDetailPage() {
    const { id } = useParams();
    const currentUser = getStoredUser();
    const { isSuper } = usePermissions();
    const isAdmin = isSuper || currentUser?.groups?.some(
        (group) => String(group).trim().toUpperCase() === "ADMIN"
    );
    const isOwnProfile = String(currentUser?.id) === String(id);

    // El guard se ejecuta antes de montar UserDetailView, evitando incluso la
    // consulta de datos de otra cuenta desde una URL escrita manualmente.
    if (!isAdmin && !isOwnProfile) {
        return <Navigate to="/" replace />;
    }

    return <UserDetailView />;
}
