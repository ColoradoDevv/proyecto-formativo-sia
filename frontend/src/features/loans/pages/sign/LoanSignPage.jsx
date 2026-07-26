import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CircleCheck, CircleX, Loader, Mail } from "lucide-react";
import { isAuthenticated } from "@/shared/services/api";
import { Button, Input } from "@/shared";
import { requestSignOtp, signLoan } from "../../services/loanService";

const PAGE = {
    READY:    "ready",     // listo para solicitar OTP
    OTP_SENT: "otp_sent",  // OTP enviado, esperando código
    SIGNING:  "signing",   // confirmando firma
    SUCCESS:  "success",
    ERROR:    "error",
};

export default function LoanSignPage() {
    const [searchParams] = useSearchParams();
    const navigate         = useNavigate();
    const token            = searchParams.get("token");

    const [pageState, setPageState] = useState(PAGE.READY);
    const [message,   setMessage]   = useState("");
    const [loanState, setLoanState] = useState(null);
    const [otpCode,   setOtpCode]   = useState("");
    const [otpInfo,   setOtpInfo]   = useState("");
    const [loading,   setLoading]   = useState(false);

    useEffect(() => {
        if (!token) {
            setMessage("El enlace no contiene un token de firma. Verifica que copiaste el enlace completo.");
            setPageState(PAGE.ERROR);
            return;
        }

        if (!isAuthenticated()) {
            const next = encodeURIComponent(`/prestamos/firmar?token=${token}`);
            navigate(`/iniciar-sesion?next=${next}`, { replace: true });
        }
    }, [token, navigate]);

    const handleRequestOtp = async () => {
        setLoading(true);
        setMessage("");
        try {
            const data = await requestSignOtp(token);
            setOtpInfo(data.message || "Código enviado a tu correo.");
            setPageState(PAGE.OTP_SENT);
        } catch (err) {
            setMessage(err.message || "No se pudo enviar el código de verificación.");
            setPageState(PAGE.ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSign = async (e) => {
        e.preventDefault();
        const code = otpCode.trim();
        if (!code) {
            setMessage("Ingresa el código de verificación de 6 dígitos.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const data = await signLoan(token, code);
            setMessage(data.message || "Firma registrada correctamente.");
            setLoanState(data.state ?? null);
            setPageState(PAGE.SUCCESS);
        } catch (err) {
            setMessage(err.message || "No se pudo procesar la firma.");
            if (err.status === 429) {
                setPageState(PAGE.ERROR);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token && pageState !== PAGE.ERROR) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <div className="bg-surface-hover rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] px-6 sm:px-10 py-10 w-full max-w-md flex flex-col items-center gap-5">

                <h1 className="text-h2 font-heading text-text-primary text-center">
                    Firma de Préstamo
                </h1>

                {pageState === PAGE.READY && (
                    <>
                        <Mail size={48} className="text-brand" />
                        <p className="text-center text-small text-text-secondary">
                            Para confirmar tu identidad, te enviaremos un código de verificación
                            de 6 dígitos a tu correo registrado en la plataforma.
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleRequestOtp}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Enviando..." : "Enviar código de verificación"}
                        </Button>
                    </>
                )}

                {pageState === PAGE.OTP_SENT && (
                    <form onSubmit={handleConfirmSign} className="w-full flex flex-col gap-4">
                        <p className="text-center text-small text-text-secondary">
                            {otpInfo}
                        </p>
                        <Input
                            label="Código de verificación"
                            name="otpCode"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="000000"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                        />
                        {message && (
                            <p className="text-small text-error text-center">{message}</p>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={loading || otpCode.length !== 6}
                            className="w-full"
                        >
                            {loading ? "Confirmando..." : "Confirmar firma"}
                        </Button>
                        <button
                            type="button"
                            onClick={handleRequestOtp}
                            disabled={loading}
                            className="text-small text-brand hover:underline underline-offset-2 transition-colors"
                        >
                            Reenviar código
                        </button>
                    </form>
                )}

                {pageState === PAGE.SUCCESS && (
                    <>
                        <CircleCheck size={52} className="text-success" />
                        <p className="text-center text-body text-text-primary font-medium">
                            {message}
                        </p>
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
                        <Link
                            to="/prestamos"
                            className="text-small text-brand hover:underline underline-offset-2 transition-colors mt-1"
                        >
                            Ver mis préstamos
                        </Link>
                    </>
                )}

                {pageState === PAGE.ERROR && (
                    <>
                        <CircleX size={52} className="text-error" />
                        <p className="text-center text-body text-text-primary font-medium">
                            No se pudo completar la firma
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
