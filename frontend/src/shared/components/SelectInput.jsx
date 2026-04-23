export default function SelectInput({
    label,
    name,
    error,
    value,
    onChange,
    required,
    options = [],
}){
    return(
        <div className="w-[320px]">
            {label && (
                <label
                    className="
                        block
                        place-self-start
                        text-[14px]
                        mb-1
                    "
                >
                    {label}
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
                    h-12
                    rounded-md
                    border
                    border-border
                    border-black
                    px-4
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:border-focus-border
                    ${error ? "border-red-500" : "border-border"}
                    ${!value ? "text-gray-400" : "text-gray-900"}
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
                <p className="text-red-800 text-[12px] place-self-start">
                    {error}
                </p>
            )}
        </div>
    )
}