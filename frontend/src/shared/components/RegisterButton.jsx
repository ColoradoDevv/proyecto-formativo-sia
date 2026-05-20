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
        inline-flex h-10 items-center gap-2 rounded-full
        bg-brand-soft px-6 text-medium font-medium text-text-primary
        transition-colors duration-200 hover:bg-brand-soft-hover
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
