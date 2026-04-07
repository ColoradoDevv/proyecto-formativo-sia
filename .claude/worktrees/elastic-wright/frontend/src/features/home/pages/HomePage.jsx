import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"

export default function HomePage(){

    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 w p-6 bg-gray-100 text-[#0C2D48] ">
                    <h2 className="font-bold text-xl">Hola!, Administrador.</h2>
                    <p className="mt-2 text-gray-700">Bienvenido al Sistema de Gestion Inventario.</p>
                </main>

            </div>

        </div>
    );
}