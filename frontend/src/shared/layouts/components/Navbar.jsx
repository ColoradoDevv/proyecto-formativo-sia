import { ChevronDown, Menu } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/shared";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser } from "@/shared/services/api"
import { logout } from "@/features/auth/services/authService";
import { cancelAlert } from "@/shared";


export default function Navbar({ onToggleSidebar }) {

    const navigate = useNavigate();

    const userPlaceholder = getStoredUser()?.first_name

        async function handleLogout() {
        const result = await cancelAlert({
            title: "¿Cerrar sesión?",
            text: "Tendrás que volver a iniciar sesión para acceder al sistema.",
            confirmText: "Sí, cerrar sesión",
            cancelText: "Seguir aquí",
        });

        if (!result.isConfirmed) return;

        logout();
        navigate("/iniciar-sesion");
    }

    return (
        <div className="bg-surface-hover px-4 sm:px-6 border-b border-border flex items-center text-text-primary h-(--size-control-2xl) shrink-0">

            {/* Hamburger — solo visible en móvil/tablet */}
            {onToggleSidebar && (
                <button
                    type="button"
                    aria-label="Abrir menú de navegación"
                    onClick={onToggleSidebar}
                    className="lg:hidden mr-3 p-1.5 rounded hover:bg-surface-muted transition-colors"
                >
                    <Menu size={22} />
                </button>
            )}

            {/* Título — completo desde sm, abreviado en móvil */}
            <h1 className="text-h2 font-heading flex-1 truncate">
                SGI - Inventario<span className="hidden sm:inline"> Teleínformatica</span>
            </h1>

            {/* Menú de usuario */}
            <Dropdown>
                <DropdownTrigger>
                    <span className="hidden lg:inline underline cursor-pointer">{userPlaceholder}</span>
                    <ChevronDown className="size-5 cursor-pointer" />
                </DropdownTrigger>
                <DropdownContent className="right-0 w-48">
                    <DropdownItem>
                        <Link to="/configuracion" className="block w-full">Ver Perfil</Link>
                    </DropdownItem>
                          <DropdownSeparator />
                    <DropdownItem>
                        <button type="button" onClick={handleLogout} className="block w-full text-left">Cerrar Sesión</button>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>

        </div>
    );
}
