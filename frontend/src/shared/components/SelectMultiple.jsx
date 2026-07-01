import { ChevronDown } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent } from "./Dropdown";
import Checkbox from "./Checkbox";

export default function SelectMultiple({
    label,
    name,
    error,
    value = [],
    className = "",
    onChange,
    required,
    options = [],
}) {
    const toggle = (id) => {
        const next = value.includes(id)
            ? value.filter((v) => v !== id)
            : [...value, id];
        onChange({ target: { name, value: next } });
    };

    const selectedLabels = options
        .filter((opt) => value.includes(String(opt.id)))
        .map((opt) => opt.label);

    return (
        <div className={className || "w-full"}>
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

            <Dropdown className="block w-full">
                <DropdownTrigger
                    className={`
                        w-full
                        justify-between
                        h-[var(--size-control-md)]
                        rounded-[var(--radius-md)]
                        border
                        px-8
                        bg-surface-hover
                        focus:outline-none
                        focus:ring-2
                        focus:border-focus-border
                        ${error ? "border-error" : "border-border"}
                        ${selectedLabels.length === 0 ? "text-text-muted" : "text-text-primary"}
                    `}
                >
                    <span className="truncate text-left flex-1">
                        {selectedLabels.length > 0 ? selectedLabels.join(", ") : "Seleccione una opción"}
                    </span>
                    <ChevronDown size={16} className="shrink-0" />
                </DropdownTrigger>

                <DropdownContent align="left" matchTriggerWidth className="max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                        <Checkbox
                            key={opt.id}
                            id={`${name}-${opt.id}`}
                            name={name}
                            label={opt.label}
                            checked={value.includes(String(opt.id))}
                            onChange={() => toggle(String(opt.id))}
                            className="px-3 py-2 hover:bg-surface-muted rounded-sm"
                        />
                    ))}
                </DropdownContent>
            </Dropdown>

            {error && (
                <p className="text-error text-small place-self-start mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
