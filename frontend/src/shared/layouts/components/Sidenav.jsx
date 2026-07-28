import { NavLink, useNavigate } from "react-router-dom";
import { House, Users, Wrench, Truck, Scroll, Settings, LogOut, X, ClipboardList } from "lucide-react";
import { logout } from "@/features/auth/services/authService";
import { cancelAlert } from "@/shared";
import { usePermissions } from "@/shared/hooks/usePermissions";

//
// Mapa de módulos del menú lateral.
// `requiredPerms`: basta con tener UNO de los codenames listados para ver el enlace.
// Si la lista está vacía, el enlace es visible para cualquier usuario autenticado.
//
const NAV_MODULES = [
    {
        to: "/",
        icon: <House size={24} />,
        label: "Inicio",
        requiredPerms: [], // visible siempre
    },
    {
        to: "/usuarios",
        icon: <Users size={24} />,
        label: "Gestión de Usuarios",
        requiredPerms: ["view_user", "create_user", "edit_user", "delete_user", "list_users"],
    },
    {
        to: "/consumibles",
        icon: <Wrench size={24} />,
        label: "Materiales de Consumo",
        // Codenames reales en BD (migración 0002)
        requiredPerms: [
            "view_consumable_material", "list_consumable_materials",
            "create_consumable_material", "update_consumable_material",
            "view_consumable", "create_consumable", "edit_consumable",
        ],
    },
    {
        to: "/devolutivos",
        icon: <Scroll size={24} />,
        label: "Materiales Devolutivos",
        // Codenames reales en BD (migración 0002)
        requiredPerms: [
            "view_returnable_material", "list_returnable_materials",
            "create_returnable_material", "update_returnable_material",
            "view_returnable", "create_returnable", "edit_returnable",
        ],
    },
    {
        to: "/prestamos",
        icon: <Truck size={24} />,
        label: "Préstamos",
        requiredPerms: ["view_loan", "create_loan", "edit_loan", "list_loans"],
    },
];

function NavLinks({ onLinkClick }) {
    const navigate = useNavigate();
    const { canAny, isSuper, isPrimaryAdmin } = usePermissions();

    // Filtramos los módulos según los permisos del usuario.
    // Si requiredPerms está vacío siempre pasa; si no, basta uno de ellos.
    const visibleModules = NAV_MODULES.filter(({ requiredPerms }) =>
        requiredPerms.length === 0 ? true : canAny(requiredPerms)
    );

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 p-2 rounded transition-colors ${
            isActive
                ? "bg-surface-muted text-primary font-medium"
                : "hover:bg-surface-muted"
        }`;

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
            <ul className="flex flex-col gap-5">
                {visibleModules.map(({ to, icon, label }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={to === "/"}
                            onClick={onLinkClick}
                            className={linkClass}
                        >
                            {icon} {label}
                        </NavLink>
                    </li>
                ))}
            </ul>

            <ul className="flex flex-col gap-5">
                {/* Configuración: superusuarios o usuarios con gestión de grupos/roles */}
                {(isSuper || canAny(["manage_groups", "manage_role_permissions", "create_role", "list_roles"])) && (
                    <li>
                        <NavLink to="/configuracion" onClick={onLinkClick} className={linkClass}>
                            <Settings size={24} /> Configuración
                        </NavLink>
                    </li>
                )}

                {/* Auditoría: solo el superadministrador primigenio */}
                {isPrimaryAdmin && (
                    <li>
                        <NavLink to="/auditoria" onClick={onLinkClick} className={linkClass}>
                            <ClipboardList size={24} /> Auditoría
                        </NavLink>
                    </li>
                )}

                {/* Cerrar sesión: siempre visible */}
                <li>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-2 rounded hover:bg-surface-muted transition-colors w-full text-left cursor-pointer"
                    >
                        <LogOut size={24} /> Cerrar sesión
                    </button>
                </li>
            </ul>
        </>
    );
}

export default function Sidenav({ isOpen = false, onClose }) {
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
