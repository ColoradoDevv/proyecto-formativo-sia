import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Asterisk } from "lucide-react";
import { useState } from "react";
import { loginSchemas } from "../schemas/loginSchemas";

export default function LoginForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = loginSchemas.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        navigate("/");
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 w-[320px]">

            <h1 className="text-center text-xl font-semibold mb-7"
                style={{ color: "var(--color-quaternary-700)" }}
            >
                Iniciar Sesión
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Correo */}
                <div>
                    <div className="relative">
                        <input
                            type="email"
                            name="userEmail"
                            placeholder="Correo Electrónico"
                            value={formData.userEmail}
                            onChange={handleChange}
                            className={`
                                w-full h-12 rounded-xl border px-4 pr-10
                                text-sm text-gray-500 bg-white
                                focus:outline-none focus:ring-2
                                focus:ring-[var(--color-quaternary-600)]/40
                                placeholder:text-gray-400
                                ${errors.userEmail ? "border-red-400" : "border-gray-200"}
                            `}
                        />
                        <Asterisk
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                    {errors.userEmail && (
                        <p className="text-red-500 text-xs mt-1 pl-1">{errors.userEmail}</p>
                    )}
                </div>

                {/* Contraseña */}
                <div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="userPassword"
                            placeholder="Contraseña"
                            value={formData.userPassword}
                            onChange={handleChange}
                            className={`
                                w-full h-12 rounded-xl border px-4 pr-10
                                text-sm text-gray-500 bg-white
                                focus:outline-none focus:ring-2
                                focus:ring-[var(--color-quaternary-600)]/40
                                placeholder:text-gray-400
                                ${errors.userPassword ? "border-red-400" : "border-gray-200"}
                            `}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    {errors.userPassword && (
                        <p className="text-red-500 text-xs mt-1 pl-1">{errors.userPassword}</p>
                    )}
                </div>

                {/* Olvidó contraseña */}
                <div className="text-center -mt-1">
                    <Link
                        to="/forgot-password"
                        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                    >
                        ¿Olvidó su contraseña?
                    </Link>
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="
                        w-full h-12 rounded-xl mt-1
                        text-white font-semibold text-sm
                        hover:opacity-90 active:scale-[0.98]
                        transition-all duration-150 shadow-md cursor-pointer
                    "
                    style={{
                        background: `linear-gradient(to right, var(--color-quaternary-600), var(--color-quaternary-950))`
                    }}
                >
                    Entrar
                </button>

            </form>
        </div>
    );
}
