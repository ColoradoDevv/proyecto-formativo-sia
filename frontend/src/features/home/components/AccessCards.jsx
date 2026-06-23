export default function AccessCards({ className = "", Icon, label, value }) {
    return (
        <div className={`bg-surface-hover rounded-[var(--radius-2xl)] cursor-pointer hover:shadow-[var(--shadow-elevation-3)] shadow-[var(--shadow-elevation-2)] p-5 w-70 flex flex-col gap-3 ${className}`}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <span className="text-text-primary text-h1">
                        {Icon}
                    </span>
                )}
                <p className="text-small font-heading text-text-primary leading-tight">{label}</p>
            </div>
            <p className="text-h1 text-text-secondary">{value}</p>
        </div>
    )
}
