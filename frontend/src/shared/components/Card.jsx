export default function Card ( { product } ){
    const { tittle, price, description, image } = product;
    return (

        <div className="
            w-[var(--size-field-md)]
            text-text-inverse
            dark:bg-background-inverse
            border border-border
            backdrop-blur-[2px]
            shadow-[var(--shadow-elevation-3)]
            rounded-[var(--radius-2xl)]
            overflow-hidden
            hover:shadow-[var(--shadow-elevation-4)]
            transition-shadow
            duration-[var(--duration-lazy)]
        ">
            <img
                src={image}
                alt={tittle}
                className="w-full h-48 object-contain"
            />

            <div className="p-5">
                {/* Titulo de la card */}
                <h2 className="text-h2 font-heading text-text-primary">{tittle}</h2>
                {/* Description */}
                <p className="text-body text-text-muted">{description}</p>
                {/* Precio del producto */}
                <p className="text-h2 font-heading text-brand">${price.toLocaleString()}</p>
            </div>
        </div>
    )
}