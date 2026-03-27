import { useId, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function SearchBar({
    id,
    name = "search",
    label,
    placeholder = "Buscar",
    supportingText,
    value,
    defaultValue = "",
    onSearch,
    onClear,
    filterOptions = [],
    filterValue,
    defaultFilterValue,
    onFilterChange,
    filterAriaLabel = "Filtrar busqueda",
    disabled = false,
    className = "",
}) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const hasFilter = filterOptions.length > 0;
    const isFilterControlled = filterValue !== undefined;
    const [internalFilterValue, setInternalFilterValue] = useState(
        defaultFilterValue ?? filterOptions[0]?.value ?? ""
    );

    const currentValue = isControlled ? value : internalValue;
    const normalizedValue = currentValue ?? "";
    const hasValue = String(normalizedValue).length > 0;
    const currentFilterValue = isFilterControlled
        ? filterValue
        : internalFilterValue;

    const handleChange = (event) => {
        const nextValue = event.target.value;

        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onSearch?.(nextValue);
    };

    const handleFilterChange = (event) => {
        const nextValue = event.target.value;

        if (!isFilterControlled) {
            setInternalFilterValue(nextValue);
        }

        onFilterChange?.(nextValue);
    };

    const handleClear = () => {
        if (!isControlled) {
            setInternalValue("");
        }

        onSearch?.("");
        onClear?.();
    };

    return (
        <div className={`w-full max-w-2xl ${className}`.trim()}>
            {label ? (
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium tracking-[0.01em] text-[#0C2D48]"
                >
                    {label}
                </label>
            ) : (
                <label htmlFor={inputId} className="sr-only">
                    Buscar
                </label>
            )}

            <div
                className={`
                    flex h-14 items-center gap-3 rounded-full border px-4
                    transition-all duration-200
                    ${disabled
                        ? "border-[#D7DEE5] bg-[#EEF2F5] text-[#7B8A97]"
                        : "border-[#C3CCD5] bg-white text-[#0C2D48] shadow-[0_1px_3px_rgba(12,45,72,0.12)] hover:border-[#93A6B8] hover:shadow-[0_6px_18px_rgba(12,45,72,0.12)] focus-within:border-[#0C2D48] focus-within:ring-4 focus-within:ring-[#DCE7EE]"
                    }
                `}
            >
                <Search
                    size={20}
                    className={disabled ? "text-[#93A1AE]" : "text-[#52606D]"}
                    aria-hidden="true"
                />

                <input
                    id={inputId}
                    name={name}
                    type="text"
                    value={normalizedValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    onChange={handleChange}
                    className={`
                        h-full w-full bg-transparent text-base outline-none
                        placeholder:text-[#7B8A97]
                        ${disabled ? "cursor-not-allowed text-[#7B8A97]" : ""}
                    `}
                />

                {hasValue && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            flex h-9 w-9 items-center justify-center rounded-full
                            text-[#52606D] transition-colors
                            hover:bg-[#E8EEF2] hover:text-[#0C2D48]
                            focus:outline-none focus:ring-2 focus:ring-[#C5D6E2]
                        "
                        aria-label="Limpiar busqueda"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                )}

                {hasFilter && (
                    <div className="flex items-center gap-2 border-l border-[#D7DEE5] pl-3">
                        <SlidersHorizontal
                            size={18}
                            className={disabled ? "text-[#93A1AE]" : "text-[#52606D]"}
                            aria-hidden="true"
                        />

                        <select
                            value={currentFilterValue}
                            onChange={handleFilterChange}
                            disabled={disabled}
                            aria-label={filterAriaLabel}
                            className={`
                                max-w-32 bg-transparent text-sm font-medium outline-none
                                ${disabled ? "cursor-not-allowed text-[#7B8A97]" : "text-[#0C2D48]"}
                            `}
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {supportingText && (
                <p className="mt-2 px-4 text-sm text-[#52606D]">
                    {supportingText}
                </p>
            )}
        </div>
    );
}
