// Imports

// Rutas
import { Routes, Route } from "react-router-dom";

// Imports Auth
import { LoginPage } from "@/features/auth"

// Imports Inicio
import { HomePage } from "@/features/home";

// Imports Usuarios 
import { UserHomePage, UserCreatePage, UserDetailPage, UserEditPage} from "@/features/users";

// Imports Material de Consumo
import { CmHomePage, CmCreatePage } from "@/features/consumable-material";

// Imports Material Devolutivo
import { RmHomePage, RmCreatePage } from "@/features/returnable-material";

// Imports de Prestamos
import { LoansHomePage, LoansCreatePage } from "@/features/loans";

// Import de Marcas
import TmHomePage from "@/features/trademarks/pages/TmHomePage";


export default function AppRouter() {
    return (
        <Routes>
            {/* Ruta de Inicio - Home */}
            <Route path="/" element={<HomePage />} />

            {/* Ruta Auth */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />

            {/* Rutas (CRUD) de Usuario */}
            <Route path="/usuarios" element={<UserHomePage />} />
            <Route path="/usuarios/crear" element={<UserCreatePage />} />
            <Route path="/usuarios/visualizar/:id" element={<UserDetailPage />} />
            <Route path="/usuarios/editar/:id" element={<UserEditPage />} />

            
            {/* Rutas (CRUD) de Materiales Consumibles */}
            <Route path="/consumibles" element={<CmHomePage />} />
            <Route path="/consumibles/crear" element={<CmCreatePage />} />

            {/* Rutas (CRUD) de Materiales Devolutivos */}
            <Route path="/devolutivos" element={<RmHomePage />} />
            <Route path="/devolutivos/crear" element={<RmCreatePage />} />

            {/* Rutas (CRUD) de Prestamos */}
            <Route path="/prestamos" element={<LoansHomePage />} />
            <Route path="/prestamos/crear" element={<LoansCreatePage/>} />

            {/* {marcas} */}
            <Route path="/marcas" element={<TmHomePage />} />

        </Routes>
    );
}
