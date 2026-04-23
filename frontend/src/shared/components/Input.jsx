export default function Input({
    label,
    type = "text",
    required,
    error,
    ...props
}){
    return(
        <div className="w-[320px]">
            {label && (
                <label 
                    className={`
                        block
                        place-self-start
                        text-[14px]
                        mb-1
                        ${error ? "text-error" : "text-text-primary"}
                    `}
                >
                    {label}
                </label>
            )}

            <div className="relative h-12 flex items-center">
                <input 
                    type={type}
                    required={required}
                    className={`
                        relative
                        w-full
                        h-12
                        rounded-md
                        border
                        px-4
                        text-base
                        bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-focus-ring
                        focus:border-focus-border
                        ${error ? "border-red-500" : "border-border"}
                    `}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-red-800 text-[12px] place-self-start">
                    {error}
                </p>
            )}
        </div>
    )
};