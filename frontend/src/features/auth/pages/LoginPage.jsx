import bgLogin from "@/assets/images/auth/bg-login.png"
import officeImg from "@/assets/images/auth/office-imagen.png"
import senaLogo from "@/assets/images/auth/logo-sena-verde-png-2022 1.png"
import LoginForm from "../components/LoginForm"

export default function LoginPage() {
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">

            {/* Fondo */}
            <img
                src={bgLogin}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Tarjeta glassmorphism — contiene TODO */}
            <div className="
                relative z-10
                w-[90%] h-[85vh]
                rounded-[var(--radius-3xl)]
                flex flex-row
                backdrop-blur-md
                bg-white/25
                border border-white/40
                shadow-[var(--shadow-elevation-5)]
                overflow-hidden
            ">
                {/* ── Lado izquierdo: logo + ilustración ── */}
                <div className="relative flex-1 flex items-end justify-center">

                    {/* Logo SENA */}
                    <div className="absolute top-6 left-6 z-10">
                        <img
                            src={senaLogo}
                            alt="Logo SENA"
                            className="h-16 w-auto object-contain"
                        />
                    </div>

                    {/* Ilustración recepcionista */}
                    <img
                        src={officeImg}
                        alt="Recepción SENA"
                        className="w-full h-full object-contain object-bottom"
                    />
                </div>

                {/* ── Lado derecho: formulario blanco ── */}
                <div className="flex items-center justify-center pr-12">
                    <LoginForm />
                </div>
            </div>

        </div>
    )
}
