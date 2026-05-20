export default function Select({
    label,
    name,
    options = [],
}){

    return(
        <div
            className="
                w-80
            "
        >
            {label && (
                <label
                    className="
                        block
                        text-caption
                        mb-1
                        place-self-start
                    "
                >
                    {label}
                </label>
            )}

            <select
                name={name}
                className="
                    w-full
                    h-14
                    border
                    border-border
                    px-4
                    bg-surface-hover
                    text-text-primary
                "
            >
                <option
                    value=""
                >
                    Seleccione una opción
                </option>

                {
                    options.map((opt) => (
                        <option
                            key={opt.id}
                            value={opt.id}
                        >
                            {opt.label}
                        </option>
                    ))
                }

            </select>

        </div>
    )
}
