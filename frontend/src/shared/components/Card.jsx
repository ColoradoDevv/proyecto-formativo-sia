export default function Card ( { product } ){
    const { tittle, price, description, image } = product;
    return (
        <div className="
            w-80
            text-text-inverse
            dark:bg-neutral-950/80 
            border border-border
            backdrop-blur-[2px] 
            shadow-lg 
            rounded-2xl 
            overflow-hidden 
            hover:shadow-black 
            transition-shadow 
            duration-700 
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