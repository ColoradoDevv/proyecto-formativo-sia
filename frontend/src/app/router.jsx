// Imports

// Rutas
import { Routes, Route, Navigate } from "react-router-dom";

// Imports Auth
import { LoginPage, ProtectedRoute, ForgotPasswordPage, ResetPasswordPage } from "@/features/auth"

// Imports Inicio
import { DashboardPage } from "@/features/dashboard";

// Imports Usuarios 
import { UserHomePage, UserCreatePage, UserDetailPage, UserEditPage} from "@/features/users";

// Imports Material de Consumo
import { CmHomePage, CmCreatePage, CmDetailPage, CmEditPage } from "@/features/consumable-material";

// Imports Material Devolutivo
import { RmHomePage, RmCreatePage, RmDetailPage, RmEditPage } from "@/features/returnable-material";

// Imports de Prestamos
import { LoansHomePage, LoansCreatePage, LoansEditPage, LoansDetailPage, LoanSignPage } from "@/features/loans";

import { ConfigLayout, MainLayout } from "@/shared";


export default function AppRouter() {
    return (
        <Routes>
            {/* ───────── Rutas PUBLICAS ───────── */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/prestamos/firmar" element={<LoanSignPage />} />

            {/* ───────── Rutas PRIVADAS (requieren sesion) ───────── */}
            <Route element={<ProtectedRoute />}>

                {/* Inicio - Home */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
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
                    <Route path="visualizar/:id" element={<LoansDetailPage />} />
                    <Route path="editar/:id" element={<LoansEditPage />} />
                </Route>

                {/* Marcas: se gestionan desde la pestaña de configuración (modales) */}
                <Route path="/marcas" element={<MainLayout />}>
                    <Route index element={<Navigate to="/configuracion" replace />} />
                </Route>


                {/* Configuracion */}
                <Route path="/configuracion" element={<ConfigLayout />} />

            </Route>
        </Routes>
    );
}
