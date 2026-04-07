import { Routes, Route } from "react-router-dom";
import { CreateUserPage, UserHomePage } from "@/features/users";
import { HomePage } from "@/features/home";
import { CmHomePage } from "@/features/consumable-material";
import { RmHomePage } from "@/features/returnable-material";
import { LoansHomePage } from "@/features/loans";

export default function AppRouter() {
    return (
        <Routes>
            {/* Ruta de Inicio - Home */}
            <Route path="/" element={<HomePage />} />

            {/* Rutas (CRUD) de Usuario */}
            <Route path="/usuarios" element={<UserHomePage />} />
            <Route path="/usuarios/crear" element={<CreateUserPage />} />

            {/* Rutas (CRUD) de Materiales Consumibles */}
            <Route path="/consumibles" element={<CmHomePage />} />

            {/* Rutas (CRUD) de Materiales Devolutivos */}
            <Route path="/devolutivos" element={<RmHomePage />} />

            {/* Rutas (CRUD) de Prestamos */}
            <Route path="/prestamos" element={<LoansHomePage />} />
        </Routes>
    );
}
