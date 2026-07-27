import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CircleCheck, CircleX, Loader, ShieldCheck, RefreshCw } from "lucide-react";
import { requestSignOtp, signLoan } from "../../services/loanService";
import { Button, Input } from "@/shared";

// ── Estados del flujo ─────────────────────────────────────────────────────
const STEP = {
    INIT:       "init",       // verificando sesión / cargando
    OTP_SENT:   "otp_sent",   // OTP enviado, usuario debe ingresarlo
    SIGNING:    "signing",    // llamada de firma en curso
    SUCCESS:    "success",    // firma registrada
    ERROR:      "error",      // error irrecuperable
};

const OTP_RESEND_COOLDOWN = 60; // segundos antes de permitir reenvío

export default function LoanSignPage() {
    const [searchParams] = useSearchParams();
    const token           = searchParams.get("token");

    const [step,       setStep]       = useState(STEP.INIT);
    const [otpCode,    setOtpCode]    = useState("");
    const [otpError,   setOtpError]   = useState("");
    const [message,    setMessage]    = useState("");
    const [loanState,  setLoanState]  = useState(null);
    const [cooldown,   setCooldown]   = useState(0);
    const [expiresMin, setExpiresMin] = useState(10);
    const timerRef = useRef(null);

    // Limpia el intervalo al desmontar
    useEffect(() => () => clearInterval(timerRef.current), []);

    // Envía la petición inicial al montar
    useEffect(() => {
        if (!token) {
            setMessage("El enlace no contiene un token de firma. Verifica que lo copiaste completo.");
            setStep(STEP.ERROR);
            return;
        }
        // Si llegamos aquí, ProtectedRoute ya garantizó que hay sesión activa.
        sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCooldown = () => {
        setCooldown(OTP_RESEND_COOLDOWN);
        timerRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const sendOtp = async () => {
        setOtpError("");
        try {
            const data = await requestSignOtp(token);
            setExpiresMin(data.expires_in_minutes ?? 10);
            setStep(STEP.OTP_SENT);
            startCooldown();
        } catch (err) {
            setMessage(err.message || "No se pudo enviar el código de verificación.");
            setStep(STEP.ERROR);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setOtpError("");
        if (!/^\d{6}$/.test(otpCode)) {
            setOtpError("Ingresa los 6 dígitos del código.");
            return;
        }
        setStep(STEP.SIGNING);
        try {
            const data = await signLoan(token, otpCode);
            setMessage(data.message || "Firma registrada correctamente.");
            setLoanState(data.state ?? null);
            setStep(STEP.SUCCESS);
        } catch (err) {
            setOtpError(err.message || "No se pudo procesar la firma.");
            setStep(STEP.OTP_SENT);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <div className="bg-surface-hover rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] px-6 sm:px-10 py-10 w-full max-w-md flex flex-col items-center gap-5">

                <h1 className="text-h2 font-heading text-text-primary text-center">
                    Firma de Préstamo
                </h1>

                {/* ── Cargando / enviando OTP ── */}
                {step === STEP.INIT && (
                    <>
                        <Loader size={48} className="text-brand animate-spin" />
                        <p className="text-center text-small text-text-secondary">
                            Verificando enlace y enviando código…
                        </p>
                    </>
                )}

                {/* ── Ingresar código OTP ── */}
                {(step === STEP.OTP_SENT || step === STEP.SIGNING) && (
                    <>
                        <ShieldCheck size={48} className="text-brand" />
                        <p className="text-center text-small text-text-secondary">
                            Te enviamos un código de verificación de 6 dígitos a tu correo
                            registrado. Válido por <strong>{expiresMin} minutos</strong>.
                        </p>

                        <form
                            onSubmit={handleConfirm}
                            className="flex flex-col gap-3 w-full"
                            noValidate
                        >
                            <Input
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength={6}
                                placeholder="000000"
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                variant="auth"
                                error={otpError}
                                className="text-center tracking-widest text-h3"
                                autoFocus
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={step === STEP.SIGNING}
                                className="w-full"
                            >
                                {step === STEP.SIGNING
                                    ? <><Loader size={16} className="animate-spin inline mr-2" />Verificando…</>
                                    : "Confirmar firma"
                                }
                            </Button>
                        </form>

                        {/* Reenviar código */}
                        <button
                            type="button"
                            disabled={cooldown > 0 || step === STEP.SIGNING}
                            onClick={sendOtp}
                            className="flex items-center gap-1 text-small text-text-muted hover:text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <RefreshCw size={13} />
                            {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
                        </button>
                    </>
                )}

                {/* ── Éxito ── */}
                {step === STEP.SUCCESS && (
                    <>
                        <CircleCheck size={52} className="text-success" />
                        <p className="text-center text-body text-text-primary font-medium">
                            {message}
                        </p>
                        {loanState === "Activo" && (
                            <p className="text-center text-small text-text-secondary">
                                Ambas partes firmaron. El préstamo ya está activo.
                            </p>
                        )}
                        {loanState === "Pendiente" && (
                            <p className="text-center text-small text-text-secondary">
                                Tu firma quedó registrada. El préstamo se activará
                                automáticamente cuando la otra parte también firme.
                            </p>
                        )}
                        <Link
                            to="/prestamos"
                            className="text-small text-brand hover:underline underline-offset-2 transition-colors mt-1"
                        >
                            Ver mis préstamos
                        </Link>
                    </>
                )}

                {/* ── Error ── */}
                {step === STEP.ERROR && (
                    <>
                        <CircleX size={52} className="text-error" />
                        <p className="text-center text-body text-text-primary font-medium">
                            No se pudo procesar la firma
                        </p>
                        <p className="text-center text-small text-text-secondary">
                            {message}
                        </p>
                        <Link
                            to="/prestamos"
                            className="text-small text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors mt-2"
                        >
                            Volver a mis préstamos
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}
