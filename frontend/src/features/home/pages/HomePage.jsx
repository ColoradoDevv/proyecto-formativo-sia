import HomeLayout from "../layouts/HomeLayout";

export default function HomePage(){
    return (
        <div className="p-6">
            <h2 className="text-h3">Hola!, Administrador.</h2>
            <p className="text-sm text-text-muted">Bienvenido al Sistema de Gestion Inventario.</p>

            <div className="pt-4">
                <HomeLayout/>
            </div>
        </div>
    );
}