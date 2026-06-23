import { createPortal } from "react-dom";

import { Button } from "@/shared"

export default function ConfirmCancelModal({ 
    isOpen, 
    onClose, 
    onConfirm,     
    className = "",
    title = "¿Cancelar el registro?",
    message = <>Se perderán todos los datos ingresados.<br />¿Deseas continuar?</>,
    confirmText = "Sí, cancelar",
    cancelText = "Seguir aquí",
}) {
    if (!isOpen) return null;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-500/20 backdrop-blur-xs"
            />

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-5)] p-8 flex flex-col items-center gap-5">

                {/* Icon ring */}
                <div className="w-16 h-16 rounded-[var(--radius-full)] bg-white/30 border border-white/50 flex items-center justify-center shadow-inner text-text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>

                {/* Text */}
                <div className="text-center flex flex-col gap-1">
                    <h2 className="text-h3 font-heading text-text-primary">
                        {title}
                    </h2>
                    <p className="text-small text-text-secondary">
                        {message}
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/40" />

                {/* Actions */}
                <div className="flex gap-2 w-full">

                    {/* <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer h-[var(--size-control-md)] rounded-[var(--radius-full)] border border-border bg-white/40 text-text-primary text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    >
                        {cancelText}
                    </button> */}

                    <Button
                    onClick={onClose}
                    variant="secondary"
                    className="self-start md:self-auto"
                    >
                        {cancelText}
                    </Button>

                    <Button
                    onClick={onConfirm}
                    className="self-start md:self-auto"
                    >
                        {confirmText}
                    </Button>

{/* 
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer h-[var(--size-control-md)] rounded-[var(--radius-full)] bg-brand border border-brand text-text-inverse text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    >
                        {confirmText}
                    </button> */}
                </div>
            </div>
        </div>,
        document.body
    );
}
