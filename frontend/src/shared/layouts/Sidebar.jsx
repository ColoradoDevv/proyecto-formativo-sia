import { Link } from "react-router-dom";
import { House, Users, Wrench, Truck, Scroll , Settings, LogOut } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-surface-hover border-r border-border text-text-primary p-5 hidden sm:flex flex-col justify-between">

            {/* TOP */}
            <ul className="flex flex-col gap-4">

                <li>
                    <Link to="/" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <House size={18} />
                        Inicio
                    </Link>
                </li>

                <li>
                    <Link to="/usuarios" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <Users size={18} />
                        Gestión de Usuarios
                    </Link>
                </li>

                <li>
                    <Link to="/consumibles" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <Wrench size={18} />
                        Materiales de Consumo
                    </Link>
                </li>

                <li>
                    <Link to="/devolutivos" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <Scroll size={18} />
                        Materiales Devolutivos
                    </Link>
                </li>

                <li>
                    <Link to="/prestamos" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <Truck size={18} />
                        Préstamos
                    </Link>
                </li>

            </ul>

            {/* BOTTOM */}
            <ul className="flex flex-col gap-4">

                <li>
                    <Link to="/configuracion" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted">
                        <Settings size={18} />
                        Configuración
                    </Link>
                </li>

                <li>
                    <Link to="/iniciar-sesion" className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted w-full text-left">
                        <LogOut size={18} />
                        Cerrar sesión
                    </Link>
                </li>

            </ul>

        </aside>
    );
}
