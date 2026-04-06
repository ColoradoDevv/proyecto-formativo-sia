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
        inline-flex h-11 items-center gap-2 rounded-md
        bg-[#64DFF0] px-5 text-[14px] font-semibold text-[#0C2D48]
        transition-colors duration-200 hover:bg-[#57D3E4]
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
