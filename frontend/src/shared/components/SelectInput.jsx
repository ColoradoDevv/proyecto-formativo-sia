export default function SelectInput({
    label,
    name,
    error,
    value,
    className = "",
    onChange,
    required,
    options = [],
}){
    return(
        <div className="w-[320px]">
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

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`
                    relative
                    w-full
                    h-14
                    rounded-md
                    border
                    px-4
                    bg-surface-hover
                    focus:outline-none
                    focus:ring-2
                    focus:border-focus-border
                    ${error ? "border-red-500" : "border-border"}
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
                    >
                        {opt.label}
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
