import Swal from "sweetalert2";
import "./swal.css";

// Mixin base: desactiva el estilo por defecto de SweetAlert2 y aplica
// las clases del sistema de diseño para que todas las alertas (success,
// error, warning, confirm, etc.) se vean consistentes entre sí.
export const swalBase = Swal.mixin({
    buttonsStyling: false,
    reverseButtons: true,
    customClass: {
        popup: "!rounded-[var(--radius-3xl)] !shadow-[var(--shadow-elevation-5)] !p-6 !bg-white/90 !backdrop-blur-2xl !border !border-white/50",
        title: "!text-h3 !font-heading !text-text-primary",
        htmlContainer: "!text-small !text-text-secondary",
        icon: "!border-0",
        actions: "!gap-3",
        confirmButton:
            "cursor-pointer h-[var(--size-control-md)] px-6 rounded-[var(--radius-full)] bg-brand border border-brand text-text-inverse text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-focus-ring",
        cancelButton:
            "cursor-pointer h-[var(--size-control-md)] px-6 rounded-[var(--radius-full)] border border-border bg-white/40 text-text-primary text-small font-medium transition-colors duration-[var(--duration-base)] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-focus-ring",
        denyButton:
            "cursor-pointer h-[var(--size-control-md)] px-6 rounded-[var(--radius-full)] bg-error border border-error text-text-inverse text-small font-medium transition-colors duration-[var(--duration-base)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-focus-ring",
    },
});
