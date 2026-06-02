// Imports

// Rutas
import { Routes, Route } from "react-router-dom";

// Imports Auth
import { LoginPage, ProtectedRoute } from "@/features/auth"

// Imports Inicio
import { HomePage } from "@/features/home";

// Imports Usuarios 
import { UserHomePage, UserCreatePage, UserDetailPage, UserEditPage} from "@/features/users";

// Imports Material de Consumo
import { CmHomePage, CmCreatePage, CmDetailPage, CmEditPage } from "@/features/consumable-material";

// Imports Material Devolutivo
import { RmHomePage, RmCreatePage, RmDetailPage } from "@/features/returnable-material";

// Imports de Prestamos
import { LoansHomePage, LoansCreatePage } from "@/features/loans";

// Import de Marcas
import TmHomePage from "@/features/trademarks/pages/TmHomePage";
import { ConfigLayout } from "@/shared";


export default function AppRouter() {
    return (
        <Routes>
            {/* ───────── Rutas PUBLICAS ───────── */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />

            {/* ───────── Rutas PRIVADAS (requieren sesion) ───────── */}
            <Route element={<ProtectedRoute />}>

                {/* Inicio - Home */}
                <Route path="/" element={<HomePage />} />

                {/* CRUD de Usuario */}
                <Route path="/usuarios" element={<UserHomePage />} />
                <Route path="/usuarios/crear" element={<UserCreatePage />} />
                <Route path="/usuarios/visualizar/:id" element={<UserDetailPage />} />
                <Route path="/usuarios/editar/:id" element={<UserEditPage />} />

                {/* CRUD de Materiales Consumibles */}
                <Route path="/consumibles" element={<CmHomePage />} />
                <Route path="/consumibles/crear" element={<CmCreatePage />} />
                <Route path="/consumibles/visualizar/:id" element={<CmDetailPage />} />
                <Route path="/consumibles/editar/:id" element={<CmEditPage />} />

                {/* CRUD de Materiales Devolutivos */}
                <Route path="/devolutivos" element={<RmHomePage />} />
                <Route path="/devolutivos/crear" element={<RmCreatePage />} />
                <Route path="/devolutivos/visualizar/:id" element={<RmDetailPage />} />

                {/* CRUD de Prestamos */}
                <Route path="/prestamos" element={<LoansHomePage />} />
                <Route path="/prestamos/crear" element={<LoansCreatePage/>} />

                {/* Marcas */}
                <Route path="/marcas" element={<TmHomePage />} />

                {/* Configuracion */}
                <Route path="/configuracion" element={<ConfigLayout />} />

            </Route>
        </Routes>
    );
}