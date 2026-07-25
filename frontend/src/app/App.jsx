import AppRouter from "./router";
import SessionExpiredModal from "@/features/auth/components/SessionExpiredModal";

export default function App() {
    return (
        <>
            <AppRouter />
            {/* Modal global de sesión expirada — escucha el evento sia:session-expired
                que dispara apiFetch ante cualquier 401 del backend. */}
            <SessionExpiredModal />
        </>
    );
}
