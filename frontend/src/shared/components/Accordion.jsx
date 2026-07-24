import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function AccordionItem({ title, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section className="border border-border rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-6
                    py-4
                    text-left
                    cursor-pointer
                    hover:bg-surface-muted
                    transition-colors
                "
            >
                <h2 className="text-text-primary font-heading">{title}</h2>
                <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-[var(--duration-lazy)] ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="px-6 pb-6">
                    {children}
                </div>
            )}
        </section>
    );
}
