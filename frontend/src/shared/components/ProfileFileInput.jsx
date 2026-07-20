import { useRef, useState, useMemo, useEffect } from "react";
import { Infinity as InfinityLoader } from "ldrs/react";
import { Upload, Pencil, X } from "lucide-react";

export default function ProfileFileInput({
    value = [],
    onChange,
    label,
    placeholder = "Subir foto",
    className = "w-full h-58",
    error,
    accept = ".jpg,.jpeg,.png",
}) {
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const preview = useMemo(() => {
        const file = value[0];
        if (!file) return null;
        if (typeof file === "string") return file;
        if (!file.type?.startsWith("image/")) return null;
        return URL.createObjectURL(file);
    }, [value]);

    useEffect(() => {
        return () => { if (preview && typeof value[0] !== "string") URL.revokeObjectURL(preview); };
    }, [preview]);

    const handleFiles = async (files) => {
        const file = files[0];
        if (!file) return;
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 400));
        onChange([file]);
        setIsLoading(false);
    };

    const remove = (e) => {
        e.stopPropagation();
        onChange([]);
    };

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className={`block place-self-start text-medium mb-1 ${error ? "text-error" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <div
                onClick={() => !isLoading && inputRef.current.click()}
                className={`relative border-2 border-dashed border-border rounded overflow-hidden cursor-pointer group ${className}`}
            >
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <InfinityLoader size="55" stroke="4" strokeLength="0.15" bgOpacity="0.1" speed="1.3" color="var(--semantic-text-primary)" />
                    </div>
                ) : preview ? (
                    <>
                        <img src={preview} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <span className="flex items-center gap-1 text-text-inverse text-medium font-medium">
                                <Pencil size={16} /> Cambiar
                            </span>
                            <button
                                type="button"
                                onClick={remove}
                                className="flex items-center gap-1 text-text-inverse text-medium font-medium"
                            >
                                <X size={16} /> Eliminar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-brand text-medium p-1">
                        <Upload size={24} />
                        {placeholder}
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
            />

            {error && <span className="text-error text-small">{error}</span>}
        </div>
    );
}
