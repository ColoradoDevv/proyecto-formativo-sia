import { forwardRef } from "react";
import { Search, X, LoaderCircle } from "lucide-react";
import clsx from "clsx";

const baseStyles = "search flex items-center rounded-full px-4 transition-all border";

const sizeStyles = {
    sm: "h-9 text-small",
    md: "h-14 text-body",
    lg: "h-16 text-body",
};

const variantStyles = {
    filled: "bg-surface-muted border-brand hover:border-brand-hover focus-within:bg-surface-hover",
    outlined: "bg-surface-hover border-brand hover:border-brand-hover",
};

const SearchField = forwardRef(
    (
        {
            value = "",
            placeholder = "Buscar",
            onChange = () => {},
            onSubmit,
            onClear = () => {},
            size = "md",
            variant = "filled",
            fullWidth = false,
            disabled = false,
            loading = false,
            error = false,
            name = "search",
            ariaLabel = "Campo de búsqueda",
            autoComplete = "off",
            icon,
            className,
        },
        ref
    ) => {
        const SearchIcon = icon || Search;

        const handleClear = () => {
            onChange("");
            onClear();
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (disabled || loading) return;
            onSubmit?.(value);
        };

        return(
            <form
                onSubmit={handleSubmit}
                className={clsx(
                    baseStyles,
                    sizeStyles[size],
                    variantStyles[variant],
                    fullWidth && "w-full",
                    disabled && "opacity-60 pointer-events-none",
                    error
                        ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500"
                        : "focus-within:ring-2 focus-within:ring-focus-ring",
                    className,
                )}
            >
                {loading ? (
                    <LoaderCircle className="size-5 shrink-0 animate-spin text-text-muted" />
                ): (
                    <SearchIcon className="size-5 shrink-0 text-text-muted" />
                )}

                <input
                    ref={ref}
                    type="search"
                    name={name}
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder}
                    aria-label={ariaLabel}
                    autoComplete={autoComplete}
                    onChange={(e) => onChange(e.target.value)}
                    className="search__input flex-1 bg-transparent px-3 outline-none"
                />

                {!!value && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                        className="search__clear rounded-full p-1 hover:bg-surface-muted"
                    >
                        <X className="size-5 text-text-muted" />
                    </button>
                )}

            </form>
        );
    }
);

SearchField.displayName = "SearchField";

export default SearchField;
