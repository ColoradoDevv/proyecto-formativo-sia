export default function Input({
    label,
    type = "text",
    required,
    className = "w-full",
    error,
    ...props
}){
    return(
        <div className={className}>
            {label && (
                <label
                    className={`
                        block
                        place-self-start
                        text-medium
                        mb-1
                        ${error ? "text-error" : "text-text-primary"}
                    `}
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <div className="relative h-[var(--size-control-xl)] flex items-center">
                <input
                    type={type}
                    required={required}
                    className={`
                        relative
                        w-full
                        h-[var(--size-control-xl)]
                        rounded-[var(--radius-md)]
                        border
                        px-4
                        text-body
                        bg-surface-hover
                        placeholder:text-text-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-focus-ring
                        focus:border-focus-border
                        ${error ? "border-error" : "border-border"}
                    `}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-error text-small place-self-start mt-1">
                    {error}
                </p>
            )}
        </div>
    )
};
