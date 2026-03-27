import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home";
import { CreateUserPage, UserHomePage } from "@/features/users";
import { CmHomePage } from "@/features/consumable-material";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/usuarios" element={<UserHomePage />} />
            <Route path="/usuarios/crear" element={<CreateUserPage />} />
            <Route path="/materiales-consumibles" element={<CmHomePage />} />
        </Routes>
    );
}
