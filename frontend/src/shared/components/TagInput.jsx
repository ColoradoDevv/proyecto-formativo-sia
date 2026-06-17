import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({
    label,
    value = [],
    onChange,
    placeholder = "Agregar...",
    error,
    className = "",
    required,
}) {
    const [inputValue, setInputValue] = useState("");

    const add = () => {
        const trimmed = inputValue.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
        setInputValue("");
    };

    const remove = (item) => {
        onChange(value.filter((v) => v !== item));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            add();
        }
    };

    return (
        <div className="w-[var(--size-field-md)]">
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

            <div className="flex gap-2 h-[var(--size-control-xl)]">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`
                        flex-1
                        h-[var(--size-control-xl)]
                        rounded-[var(--radius-md)]
                        border
                        px-4
                        text-body
                        bg-surface-hover
                        placeholder:text-text-muted
                        focus:outline-none
                        focus:ring-2
                        focus:ring-focus-ring
                        focus:border-focus-border
                        ${error ? "border-error" : "border-border"}
                    `}
                />
                <button
                    type="button"
                    onClick={add}
                    className="h-[var(--size-control-xl)] px-4 rounded-[var(--radius-md)] bg-brand text-text-inverse text-medium hover:opacity-90 transition-opacity"
                >
                    Agregar
                </button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {value.map((item) => (
                        <span
                            key={item}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-muted border border-border text-small text-text-primary"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => remove(item)}
                                className="text-text-muted hover:text-error transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-error text-small place-self-start mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
