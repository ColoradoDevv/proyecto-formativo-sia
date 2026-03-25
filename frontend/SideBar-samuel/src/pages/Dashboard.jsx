import React from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO VACÍO */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <h1 className="text-gray-400 text-xl">
          Selecciona una opción del menú
        </h1>
      </main>

    </div>
  );
}