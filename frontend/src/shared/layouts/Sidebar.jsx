import { Link, useNavigate } from "react-router-dom";
import { House, Users, Wrench, Truck, Scroll, Settings, LogOut, X } from "lucide-react";
import { logout } from "@/features/auth/services/authService";
import { cancelAlert } from "@/shared";

function NavLinks({ onLinkClick }) {
    const navigate = useNavigate();

    const topLinks = [
        { to: "/",            icon: <House size={18} />,  label: "Inicio" },
        { to: "/usuarios",    icon: <Users size={18} />,  label: "Gestión de Usuarios" },
        { to: "/consumibles", icon: <Wrench size={18} />, label: "Materiales de Consumo" },
        { to: "/devolutivos", icon: <Scroll size={18} />, label: "Materiales Devolutivos" },
        { to: "/prestamos",   icon: <Truck size={18} />,  label: "Préstamos" },
    ];

    const linkClass = "flex items-center gap-3 p-2 rounded hover:bg-surface-muted transition-colors";


    async function handleLogout() {
        const result = await cancelAlert({
            title: "¿Cerrar sesión?",
            text: "Tendrás que volver a iniciar sesión para acceder al sistema.",
            confirmText: "Sí, cerrar sesión",
            cancelText: "Seguir aquí",
        });

        if (!result.isConfirmed) {
            onLinkClick?.();
            return;
        }

        logout();
        navigate("/iniciar-sesion");
    }

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
                {/* Configuracion: navegacion normal */}
                <li>
                    <Link to="/configuracion" onClick={onLinkClick} className={linkClass}>
                        <Settings size={18} /> Configuración
                    </Link>
                </li>

                {/* Cerrar sesion: es una ACCION, no un enlace */}
                <li>
                    <button type="button" onClick={handleLogout} className={`${linkClass} w-full text-left cursor-pointer`}>
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </li>
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
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-[var(--duration-slow)] ${isOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={onClose}
                />

                {/* Panel deslizante */}
                <aside
                    className={`
                        absolute left-0 top-0 h-full w-[var(--size-field-sm)]
                        bg-surface-hover border-r border-border text-text-primary
                        p-5 flex flex-col justify-between
                        transition-transform duration-[var(--duration-slow)] ease-in-out
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
            <aside className="hidden lg:flex w-[var(--size-field-sm)] bg-surface-hover border-r border-border text-text-primary p-5 flex-col justify-between shrink-0">
                <NavLinks />
            </aside>
        </>
    );
}