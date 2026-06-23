import { Pencil } from "lucide-react";
import ActiveSwitch from "./ActiveSwitch";
import { IconButton } from "./IconButton";

export default function Card({
    id,
    number,
    title,
    subtitle,
    active,
    toggleFn,
    entity,
    onEdit,
    gradientClassName = "bg-gradient-to-b from-[#0f2942] to-[#bfe3ef]",
    className = "",
}) {
    return (
        <div className={`w-[var(--size-field-md)] rounded-[var(--radius-2xl)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-elevation-2)] ${className}`}>
            <div className={`relative h-28 ${gradientClassName}`}>
                {number && (
                    <span className="absolute top-3 right-3 bg-surface text-text-primary text-caption font-semibold rounded-[var(--radius-md)] px-2 py-1 shadow-[var(--shadow-elevation-1)]">
                        {number}
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-medium font-heading text-text-primary">{title}</h3>
                        {subtitle && <p className="text-small text-text-muted">{subtitle}</p>}
                    </div>
                    <ActiveSwitch id={id} isActive={active} toggleFn={toggleFn} entity={entity} size="sm" />
                </div>

                <IconButton
                    onClick={onEdit}
                    variant="default"
                    hitSize={32}
                    iconSize={16}
                    className="bg-surface-muted text-text-secondary self-start"
                    ariaLabel="Editar"
                >
                    <Pencil size={16} />
                </IconButton>
            </div>
        </div>
    );
}
