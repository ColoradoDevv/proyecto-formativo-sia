import { ChevronDown, Menu } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import { Link } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {
    return (
        <div className="bg-surface-hover px-4 sm:px-6 border-b border-border flex items-center text-text-primary h-16 shrink-0">

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

            {/* Título */}
            <h1 className="text-h2 font-heading font-semibold flex-1 truncate">
                SIA - Inventario Teleínformatica
            </h1>

            {/* Menú de usuario */}
            <Dropdown>
                <DropdownTrigger>
                    <span className="hidden lg:inline underline cursor-pointer">Administrador</span>
                    <ChevronDown className="size-5 cursor-pointer" />
                </DropdownTrigger>
                <DropdownContent className="right-0 w-48">
                    <DropdownItem>
                        <Link to="/auth" className="block w-full">Auth</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="/dashboard" className="block w-full">Dashboard</Link>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>

        </div>
    );
}
