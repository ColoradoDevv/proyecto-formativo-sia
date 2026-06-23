import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Asterisk } from "lucide-react";
import { useState } from "react";
import { loginSchemas } from "../schemas/loginSchemas";
import { login } from "../services/authService";
import { Button } from "@/shared"

export default function LoginForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        // 1. Validar el formulario con zod
        const result = loginSchemas.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});

        // 2. Llamar al backend
        try {
            setLoading(true);
            await login(formData.userEmail, formData.userPassword);
            navigate("/");   // exito -> al inicio
        } catch (err) {
            setServerError(err.message);   // ej. "Credenciales inválidas"
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface-hover rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] px-8 py-10 w-[var(--size-field-md)]">
            <h1 className="text-center text-h2 font-heading mb-7 text-text-primary">
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
                            className={`w-full h-[var(--size-control-lg)] rounded-[var(--radius-xl)] border px-4 pr-10 text-small text-text-primary bg-surface-hover focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder:text-text-muted ${errors.userEmail ? "border-error" : "border-border"}`}
                        />
                        <Asterisk size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                    {errors.userEmail && (
                        <p className="text-error text-caption mt-1 pl-1">{errors.userEmail}</p>
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
                            className={`w-full h-[var(--size-control-lg)] rounded-[var(--radius-xl)] border px-4 pr-10 text-small text-text-primary bg-surface-hover focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder:text-text-muted ${errors.userPassword ? "border-error" : "border-border"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors "
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    {errors.userPassword && (
                        <p className="text-error text-caption mt-1 pl-1">{errors.userPassword}</p>
                    )}
                </div>

                {/* Error del servidor */}
                {serverError && (
                    <p className="text-error text-small text-center">{serverError}</p>
                )}

                {/* Olvidó contraseña */}
                <div className="text-center -mt-1">
                    <Link to="/forgot-password" className="text-caption text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors">
                        ¿Olvidó su contraseña?
                    </Link>
                </div>

                {/* Botón */}
                <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="md"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
            </form>
        </div>
    );
}