import { createPortal } from "react-dom";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-500/20 backdrop-blur-xs"
            />

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5">

                {/* Icon ring */}
                <div className="w-16 h-16 rounded-full bg-white/30 border border-white/50 flex items-center justify-center shadow-inner">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0C2D48"
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
                    <h2 className="text-lg font-bold text-[#0C2D48]">
                        {title}
                    </h2>
                    <p className="text-sm text-[#526B7B]">
                        {message}
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/40" />

                {/* Actions */}
                <div className="flex gap-3 w-full">
                    <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer h-10 rounded-full border border-[#CAD5D3] bg-white/40 text-[#0C2D48] text-sm font-medium transition-colors duration-200 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#AFBCBF]"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer h-10 rounded-full bg-[#203F57] border border-[#203F57] text-white text-sm font-medium transition-colors duration-200 hover:bg-[#0C2D48] focus:outline-none focus:ring-2 focus:ring-[#AFBCBF]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
