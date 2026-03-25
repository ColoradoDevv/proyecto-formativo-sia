export default function Button({
    variant = "primary", // Define el estilo visual
    size = "md", // Define el tamaño visual del boton
    type = "button", // Tipos de botones: button, submit, reset
    children, // Contenido interno del boton (texto, iconos, etc.)
    ...props // Propiedades adicionales (onClick, disabled, etc.)
}) {
    const variants = {
        primary: "bg-green text-brand border",
        secondary: "bg-background border border-border text-text-inverse hover:bg-surface-muted",
    };

    const sizes = {
        sm: `
            h-9 px-3
            before:absolute before:content-['']
            before:-inset-y-[6px] before:-inset-x-[0px]
        `,
        md: `
            h-10 px-4
            before:absolute before:content-['']
            before:-inset-y-[5px] before:-inset-x-[0px]
        `
    };

    return (
        <button
        type={type}
        className={`
            relative
            cursor-pointer
            inline-flex items-center justify-center
            rounded-md
            transition-colors
            ${variants[variant]}
            ${sizes[size]}
        `}
            {...props}
        >
            {children}
        </button>
    );
}
