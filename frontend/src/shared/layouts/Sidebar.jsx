import { Link } from "react-router-dom";
import { House, Users, Wrench, Truck, Scroll, Settings, LogOut, X } from "lucide-react";

function NavLinks({ onLinkClick }) {
    const topLinks = [
        { to: "/",            icon: <House size={18} />,  label: "Inicio" },
        { to: "/usuarios",    icon: <Users size={18} />,  label: "Gestión de Usuarios" },
        { to: "/consumibles", icon: <Wrench size={18} />, label: "Materiales de Consumo" },
        { to: "/devolutivos", icon: <Scroll size={18} />, label: "Materiales Devolutivos" },
        { to: "/prestamos",   icon: <Truck size={18} />,  label: "Préstamos" },
    ];
    const bottomLinks = [
        { to: "/configuracion",  icon: <Settings size={18} />, label: "Configuración" },
        { to: "/iniciar-sesion", icon: <LogOut size={18} />,   label: "Cerrar sesión" },
    ];

    const linkClass = "flex items-center gap-3 p-2 rounded hover:bg-surface-muted transition-colors";

    return (
        <>
            <ul className="flex flex-col gap-4">
                {topLinks.map(({ to, icon, label }) => (
                    <li key={to}>
                        <Link to={to} onClick={onLinkClick} className={linkClass}>
                            {icon} {label}
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="flex flex-col gap-4">
                {bottomLinks.map(({ to, icon, label }) => (
                    <li key={to}>
                        <Link to={to} onClick={onLinkClick} className={linkClass}>
                            {icon} {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default function Sidebar({ isOpen = false, onClose }) {
    return (
        <>
            {/* ── Móvil / tablet: drawer con overlay ── */}
            <div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}>

                {/* Backdrop */}
                <div
                    role="presentation"
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={onClose}
                />

                {/* Panel deslizante */}
                <aside
                    className={`
                        absolute left-0 top-0 h-full w-64
                        bg-surface-hover border-r border-border text-text-primary
                        p-5 flex flex-col justify-between
                        transition-transform duration-300 ease-in-out
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    <div className="flex flex-col gap-4">
                        {/* Botón cerrar */}
                        <button
                            type="button"
                            aria-label="Cerrar menú"
                            onClick={onClose}
                            className="self-end p-1 rounded hover:bg-surface-muted transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <NavLinks onLinkClick={onClose} />
                    </div>
                </aside>

            </div>

            {/* ── Desktop: sidebar estático ── */}
            <aside className="hidden lg:flex w-64 bg-surface-hover border-r border-border text-text-primary p-5 flex-col justify-between shrink-0">
                <NavLinks />
            </aside>
        </>
    );
}
