// Imports

// Rutas
import { Routes, Route, Navigate } from "react-router-dom";

// Imports Auth
import { LoginPage, ProtectedRoute } from "@/features/auth"

// Imports Inicio
import { HomePage } from "@/features/home";

// Imports Usuarios 
import { UserHomePage, UserCreatePage, UserDetailPage, UserEditPage} from "@/features/users";

// Imports Material de Consumo
import { CmHomePage, CmCreatePage, CmDetailPage, CmEditPage } from "@/features/consumable-material";

// Imports Material Devolutivo
import { RmHomePage, RmCreatePage, RmDetailPage, RmEditPage } from "@/features/returnable-material";

// Imports de Prestamos
import { LoansHomePage, LoansCreatePage } from "@/features/loans";

import { TmCreatePage, BrandDetailPage, BrandEditPage } from "@/features/trademarks";
import { ConfigLayout, MainLayout } from "@/shared";


export default function AppRouter() {
    return (
        <Routes>
            {/* ───────── Rutas PUBLICAS ───────── */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />

            {/* ───────── Rutas PRIVADAS (requieren sesion) ───────── */}
            <Route element={<ProtectedRoute />}>

                {/* Inicio - Home */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                </Route>

                {/* CRUD de Usuario */}
                <Route path="/usuarios" element={<MainLayout />}>
                    <Route index element={<UserHomePage />} />
                    <Route path="crear" element={<UserCreatePage />} />
                    <Route path="visualizar/:id" element={<UserDetailPage />} />
                    <Route path="editar/:id" element={<UserEditPage />} />
                </Route>

                {/* CRUD de Materiales Consumibles */}
                <Route path="/consumibles" element={<MainLayout />}>
                    <Route index element={<CmHomePage />} />
                    <Route path="crear" element={<CmCreatePage />} />
                    <Route path="visualizar/:id" element={<CmDetailPage />} />
                    <Route path="editar/:id" element={<CmEditPage />} />
                </Route>

                {/* CRUD de Materiales Devolutivos */}
                <Route path="/devolutivos" element={<MainLayout />}>
                    <Route index element={<RmHomePage />} />
                    <Route path="crear" element={<RmCreatePage />} />
                    <Route path="visualizar/:id" element={<RmDetailPage />} />
                    <Route path="editar/:id" element={<RmEditPage />} />
                </Route>

                {/* CRUD de Prestamos */}
                <Route path="/prestamos" element={<MainLayout />}>
                    <Route index element={<LoansHomePage />} />
                    <Route path="crear" element={<LoansCreatePage />} />
                </Route>

                {/* Marcas */}
                <Route path="/marcas" element={<MainLayout />}>
                    <Route index element={<Navigate to="/configuracion" replace />} />
                    <Route path="crear" element={<TmCreatePage />} />
                    <Route path="visualizar/:id" element={<BrandDetailPage />} />
                    <Route path="editar/:id" element={<BrandEditPage />} />
                </Route>


                {/* Configuracion */}
                <Route path="/configuracion" element={<ConfigLayout />} />

            </Route>
        </Routes>
    );
}
