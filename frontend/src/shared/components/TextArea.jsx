export default function TextArea({
    label,
    required,
    className = "w-full",
    error,
    hint,
    rows = 4,
    ...props
}){
    return(
        <div className={className}>
            {label && (
                <label
                    className={`
                        block
                        place-self-start
                        text-small
                        mb-1
                        ${error ? "text-error" : "text-text-primary"}
                    `}
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <div className="relative flex items-center">
                <textarea
                    required={required}
                    rows={rows}
                    className={`
                        relative
                        w-full
                        rounded-[var(--radius-md)]
                        border
                        px-4
                        py-2
                        text-body
                        bg-surface-hover
                        placeholder:text-text-muted
                        resize-none
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

            {!error && hint && (
                <p className="text-text-muted text-small place-self-start mt-1">
                    {hint}
                </p>
            )}
        </div>
    )
};
