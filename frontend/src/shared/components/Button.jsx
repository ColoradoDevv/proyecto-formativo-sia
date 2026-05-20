export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    ...props
}) {
    const variants = {
        primary:   "bg-brand text-text-inverse border border-brand hover:bg-brand-hover",
        secondary: "bg-transparent border border-border text-text-primary hover:bg-surface-muted",
        soft:      "bg-brand-soft text-text-primary border border-brand-soft hover:bg-brand-soft-hover",
        table:     "bg-surface-muted border border-brand text-text-primary hover:bg-brand hover:text-text-inverse",
    };

    const sizes = {
        sm:  `h-8 px-4 text-small font-medium gap-1
              before:absolute before:content-['']
              before:-inset-y-[6px] before:-inset-x-[0px]`,
        md:  `h-10 px-6 text-medium font-medium gap-2 rounded-full`,
        smm: `h-8 w-64 px-2 text-small
              before:absolute before:content-['']
              before:-inset-y-[5px] before:-inset-x-[0px]`,
    };

    return (
        <button
            type={type}
            className={`
                relative
                cursor-pointer
                inline-flex items-center justify-center
                rounded-full
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-60
                ${variants[variant]}
                ${sizes[size]}
            `}
            {...props}
        >
            {children}
        </button>
    );
}
