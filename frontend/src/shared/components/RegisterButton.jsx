import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function RegisterButton({
    children = "Registrar",
    className = "",
    to,
    type = "button",
    ...props
}) {
    const baseClassName = `
        inline-flex h-[var(--size-control-md)] items-center gap-2 rounded-[var(--radius-full)]
        bg-brand-soft px-6 text-medium font-medium text-text-primary
        transition-colors duration-[var(--duration-base)] hover:bg-brand-soft-hover
        focus:outline-none active:outline-none
        ${className}
    `.trim();

    if (to) {
        return (
            <Link to={to} className={baseClassName} {...props}>
                <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={baseClassName}
            {...props}
        >
            <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>{children}</span>
        </button>
    );
}
