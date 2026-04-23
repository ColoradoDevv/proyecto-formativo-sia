export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    ...props
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
            inline-flex h-11 items-center gap-2 rounded-md
            bg-[#64DFF0] px-5 text-[14px] font-semibold text-[#0C2D48]
            transition-colors duration-200 hover:bg-[#57D3E4]
            focus:outline-none active:outline-none
        `,
        md2: `
            inline-flex h-11 items-center gap-2 rounded-md
            bg-[#173B5C] px-5 text-[14px] font-semibold text-white
            shadow-sm transition-colors duration-200
            hover:bg-[#12324E]
            focus:outline-none focus:ring-0 focus:ring-[#9BB5CB] focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-60
        `,
        smm: `
            h-8 w-64 px-2
            color-black
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