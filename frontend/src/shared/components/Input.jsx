export default function Input({
    label,
    type = "text",
    ...props
}){
    // Cuerpo de la función
    return(
        // Contenedor del input que se exporta con label, cuerpo y feedback meesage
        <div className="w-[320px]">
            {/* Label */}
            {label && (
                <label 
                    className="
                        block
                        place-self-start
                        text-[8px]
                        mb-1
                    ">
                    {label}
                </label>
            )}
            {/* Contenedor del input */}
            <div 
                className="
                    relative
                    h-12
                    flex
                    items-center
                ">

                {/* Área interactiva invisible de un input 48px */}
                <div 
                    className="
                        absolute
                        inset-0

                    "
                    onMouseDown={(e) => {
                        e.preventDefault();
                        /* Mueve el foco al siguiente elemento hermano del elemento actual. 'currentTarget' referencia el elemento que tiene el handler del evento. */
                        e.currentTarget.nextSibling.focus();
                    }}
                    >

                </div>

                {/* Área visual del input */}
                <input 
                    type={type}
                    className="
                        relative
                        w-full
                        h-12
                        rounded-md
                        border
                        border-border
                        px-4
                        text-base
                        
                        focus:outline-none
                        focus:ring-2
                        focus: ring-focus-ring
                        focus: border-focus-border
                    "
                        {...props}
                    >
                </input>

            </div>


        </div>
    )
};