import clsx from "clsx"
import React from "react"

export const IconButton = React.forwardRef(function IconButton(
    {
        children,
        onClick,
        disabled = false,
        className = "",
        variant = "default",

        // Tamaños
        hitSize = 48,
        iconSize = 24,

        // Accesibilidad
        ariaLabel,

        // Estados
        isActive = false,

        ...props
    },
    ref
    ) {
    const baseStyles = `
        inline-flex items-center justify-center
        rounded-full
        transition-colors duration-200
        cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
    `

    const variants = {
        default: `
            text-white
            hover:bg-neutral-200
            hover:text-black
            focus-visible:ring-neutral-400

        `,
        ghost: `
        text-neutral-600
        hover:bg-neutral-100
        focus-visible:ring-neutral-300
        `,
        primary: `
        text-white bg-blue-600
        hover:bg-neutral-700
        focus-visible:ring-blue-300
        cursor-pointer
        `,
    }

    return (
        <button
            ref={ref}
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            disabled={disabled}
            className={clsx(baseStyles, variants[variant], className, {
                "bg-neutral-300": isActive, 
            })}
            style={{
                width: `${hitSize}px`,
                height: `${hitSize}px`,
            }}
            {...props}
        >
            <span 
                style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                }}
                className="flex items-center justify-center"
                >
                {children}
            </span>
        </button>
    )
})