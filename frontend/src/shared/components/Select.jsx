const MAX_OPTION_LENGTH = 40;

function truncateLabel(label, max = MAX_OPTION_LENGTH) {
    if (typeof label !== "string" || label.length <= max) return label;
    return `${label.slice(0, max)}…`;
}

export default function Select({
    label,
    labelAction,
    name,
    error,
    value,
    className = "",
    onChange,
    required,
    disabled = false,
    options = [],
}){
    return(
        <div className={className || "w-full"}>
            {label && (
                <div className="flex items-center justify-between gap-2 mb-1">
                    <label
                        className={`
                            block
                            place-self-start
                            text-small
                            ${error ? "text-error" : "text-text-primary"}
                        `}
                    >
                        {label}
                        {required && <span className="text-error ml-1">*</span>}
                    </label>
                    {labelAction}
                </div>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
                    relative
                    w-full
                    max-w-full
                    h-[var(--size-control-md)]
                    rounded-[var(--radius-md)]
                    border
                    px-8
                    bg-surface-hover
                    truncate
                    focus:outline-none
                    focus:ring-2
                    focus:border-focus-border
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${error ? "border-error" : "border-border"}
                    ${!value ? "text-text-muted" : "text-text-primary"}
                `}
            >
                <option value="">
                    Seleccione una opción
                </option>

                {options.map((opt) => (
                    <option
                        key={opt.id}
                        value={opt.id}
                        title={opt.label}
                    >
                        {truncateLabel(opt.label)}
                    </option>
                ))}

            </select>

            {error && (
                <p className="text-error text-small place-self-start mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}
