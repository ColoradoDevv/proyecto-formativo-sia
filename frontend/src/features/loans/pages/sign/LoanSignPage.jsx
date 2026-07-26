import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { signLoan } from "../../services/loanService";

// ─── Estados internos ────────────────────────────────────────────────────────
const STATE = {
    LOADING:  "loading",   // verificando el token
    SUCCESS:  "success",   // firma registrada correctamente
    ERROR:    "error",     // token inválido / ya usado / expirado
};

export default function LoanSignPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [pageState, setPageState]   = useState(STATE.LOADING);
    const [message,   setMessage]     = useState("");
    const [loanState, setLoanState]   = useState(null); // 'Activo' | 'Pendiente'

    useEffect(() => {
        if (!token) {
            setMessage("El enlace no contiene un token de firma. Verifica que copiaste el enlace completo.");
            setPageState(STATE.ERROR);
            return;
        }

        signLoan(token)
            .then((data) => {
                setMessage(data.message || "Firma registrada correctamente.");
                setLoanState(data.state ?? null);
                setPageState(STATE.SUCCESS);
            })
            .catch((err) => {
                setMessage(err.message || "No se pudo procesar la firma. El enlace puede estar expirado o ya fue utilizado.");
                setPageState(STATE.ERROR);
            });
    // Solo se ejecuta una vez al montar la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <div className="bg-surface-hover rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] px-6 sm:px-10 py-10 w-full max-w-md flex flex-col items-center gap-5">

                {/* Encabezado */}
                <h1 className="text-h2 font-heading text-text-primary text-center">
                    Firma de Préstamo
                </h1>

                {/* Estado: cargando */}
                {pageState === STATE.LOADING && (
                    <>
                        <Loader size={48} className="text-brand animate-spin" />
                        <p className="text-center text-small text-text-secondary">
                            Verificando tu firma…
                        </p>
                    </>
                )}

                {/* Estado: éxito */}
                {pageState === STATE.SUCCESS && (
                    <>
                        <CircleCheck size={52} className="text-success" />
                        <p className="text-center text-body text-text-primary font-medium">
                            {message}
                        </p>

                        {/* Detalle adicional según si ya está activo o pendiente */}
                        {loanState === "Activo" && (
                            <p className="text-center text-small text-text-secondary">
                                Ambas partes firmaron. El préstamo ya está activo y el
                                material puede ser retirado.
                            </p>
                        )}
                        {loanState === "Pendiente" && (
                            <p className="text-center text-small text-text-secondary">
                                Tu firma quedó registrada. El préstamo se activará
                                automáticamente cuando la otra parte también firme.
                            </p>
                        )}
                    </>
                )}

                {/* Estado: error */}
                {pageState === STATE.ERROR && (
                    <>
                        <CircleX size={52} className="text-error" />
                        <p className="text-center text-body text-text-primary font-medium">
                            No se pudo registrar la firma
                        </p>
                        <p className="text-center text-small text-text-secondary">
                            {message}
                        </p>
                    </>
                )}

                {/* Volver al inicio (solo si hay sesión o como acción secundaria) */}
                {pageState !== STATE.LOADING && (
                    <Link
                        to="/iniciar-sesion"
                        className="text-small text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors mt-2"
                    >
                        Ir al inicio de sesión
                    </Link>
                )}
            </div>
        </div>
    );
}
