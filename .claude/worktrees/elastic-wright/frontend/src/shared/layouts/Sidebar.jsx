import { Link } from "react-router-dom";
import { House, Users, Wrench, Truck, Scroll , Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-300 text-[#0C2D48] p-5 flex flex-col justify-between">
            
            {/* TOP */}
            <ul className="flex flex-col gap-4">

                <li>
                    <Link to="/" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <House size={18} />
                        Inicio
                    </Link>
                </li>

                <li>
                    <Link to="/usuarios" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <Users size={18} />
                        Gestión de Usuarios
                    </Link>
                </li>

                <li>
                    <Link to="/consumibles" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <Wrench size={18} />
                        Materiales de Consumo
                    </Link>
                </li>

                <li>
                    <Link to="/devolutivos" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <Scroll size={18} />
                        Materiales Devolutivos
                    </Link>
                </li>

                <li>
                    <Link to="/prestamos" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <Truck size={18} />
                        Préstamos
                    </Link>
                </li>

            </ul>

            {/* BOTTOM */}
            <ul className="flex flex-col gap-4">

                <li>
                    <Link to="/configuracion" className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3]">
                        <Settings size={18} />
                        Configuración
                    </Link>
                </li>

                <li>
                    <button className="flex items-center gap-3 p-2 rounded hover:bg-[#E1EBE3] w-full text-left">
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </li>

            </ul>

        </aside>
    );
}