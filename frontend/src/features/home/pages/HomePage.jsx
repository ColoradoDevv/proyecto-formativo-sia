import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"

export default function HomePage(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 w p-6 bg-background text-text-primary">
                    <h2 className="text-h3">Hola!, Administrador.</h2>
                    <p className="text-sm text-text-muted">Bienvenido al Sistema de Gestion Inventario.</p>
                </main>

            <div className="pt-4">
                <HomeLayout/>
            </div>
        </div>
    );
}
