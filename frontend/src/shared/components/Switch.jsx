import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export default function StatusSwitch({
    checked = false,
    onChange,
    disabled = false,
    className,
    size = "md",
}){

    const [ isActive, setIsActive ] = useState(checked)

    useEffect(() => {
        setIsActive(checked);
    }, [checked]);

    const handleToggle = () => {
        if(disabled) return;
        const newValue = !isActive;
        setIsActive(newValue);
        if (onChange){
            onChange(newValue);
        }
    };

    const sizes = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
    };

    const knobSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return(
        <button
            onClick={handleToggle}
            disabled={disabled}
            className={`
                relative items-center
                rounded-full transition-colors
                ${sizes[size]}
                ${isActive ? "bg-brand" : "bg-surface-muted"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className}
            `}
        >
            <span
                className={`
                    absolute left-0.5 flex items-center justify-center
                    rounded-full bg-surface-hover shadow
                    transition-transform
                    ${knobSizes[size]}
                    ${isActive ? "translate-x-full" : "translate-x-0"}
                `}
            >
                {isActive ? (
                    <Check size={12} className="text-brand"/>
                ) : (
                    <X size={12} className="text-text-muted"/>
                )}
            </span>
        </button>
    );
}
