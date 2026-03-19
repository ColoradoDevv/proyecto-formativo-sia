import React from "react";
import {
  Home,
  Users,
  Wrench,
  Package,
  Truck,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-xl p-5 flex flex-col justify-between">

      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="/sia-ico-1.png" 
            alt="logo"
            className="w-12 h-12 object-contain rounded-lg shadow"
          />

          <div>
            <h1 className="text-md font-bold text-primary">
              SIA
            </h1>
            <p className="text-xs text-gray-500">
              Teleinformática
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-2">

          <a className="flex items-center gap-3 p-2 bg-primary hover:bg-cyan-400 rounded-lg cursor-pointer transition duration-200">
            <Home size={18} /> Inicio
          </a>

          <a className="flex items-center gap-3 p-2 hover:bg-cyan-400 rounded-lg cursor-pointer transition duration-200">
            <Users size={18} /> Gestión de usuarios
          </a>

          <a className="flex items-center gap-3 p-2 hover:bg-cyan-400 rounded-lg cursor-pointer transition duration-200">
            <Wrench size={18} /> Material de Consumo
          </a>

          <a className="flex items-center gap-3 p-2 hover:bg-cyan-400 rounded-lg cursor-pointer transition duration-200">
            <Package size={18} /> Material Devolutivo
          </a>

          <a className="flex items-center gap-3 p-2 hover:bg-cyan-400 rounded-lg cursor-pointer transition duration-200">
            <Truck size={18} /> Préstamos
          </a>

        </nav>
      </div>

      {/* FOOTER */}
      <div className="space-y-3">

        <p className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer transition duration-200">
          <Settings size={18} /> Configuración
        </p>

        <p className="flex items-center gap-2 text-red-500 cursor-pointer transition duration-200">
          <LogOut size={18} /> Cerrar sesión
        </p>

      </div>

    </aside>
  );
}