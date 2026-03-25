import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home";
import { UserHomePage } from "@/features/users";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/usuarios" element={<UserHomePage />} />
        </Routes>
    );
}