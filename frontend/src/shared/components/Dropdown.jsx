import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"

// ─── Context ────────────────────────────────────────────────────────────────

export const DropdownContext = createContext(null)

// ─── Dropdown (root) ────────────────────────────────────────────────────────

export function Dropdown({
    children,
    open: controlledOpen,
    onOpenChange,
    className = "",
}) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    // Wrapped in useCallback para evitar re-renders y closures stale en efectos
    const setOpen = useCallback(
        (value) => {
            if (isControlled) {
                onOpenChange?.(value)
            } else {
                setUncontrolledOpen(value)
            }
        },
        [isControlled, onOpenChange]
    )

    const containerRef = useRef(null)
    const triggerRef   = useRef(null)  // expuesto al contexto para que DropdownContent mida posición

    // Click fuera del componente → cerrar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [setOpen])

    // Tecla Escape → cerrar
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [setOpen])

    return (
        <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
            <div
                ref={containerRef}
                className={`relative inline-block ${className}`}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    )
}

// ─── DropdownTrigger ─────────────────────────────────────────────────────────

export function DropdownTrigger({ children, className = "" }) {
    const { open, setOpen, triggerRef } = useContext(DropdownContext)

    return (
        <button
            ref={triggerRef}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="menu"
            className={`flex items-center gap-1 cursor-pointer ${className}`}
        >
            {children}
        </button>
    )
}

// ─── DropdownContent ─────────────────────────────────────────────────────────

export function DropdownContent({ children, className = "" }) {
    const { open, triggerRef } = useContext(DropdownContext)

    // "up" | "down" — se calcula justo antes de pintar
    const [direction, setDirection] = useState("down")
    const contentRef = useRef(null)

    useEffect(() => {
        if (!open) return

        // Necesitamos un frame para que el DOM haya pintado el contenido
        // y podamos leer su offsetHeight real
        const frame = requestAnimationFrame(() => {
            if (!contentRef.current || !triggerRef?.current) return

            const triggerRect   = triggerRef.current.getBoundingClientRect()
            const contentHeight = contentRef.current.offsetHeight
            const spaceBelow    = window.innerHeight - triggerRect.bottom
            const spaceAbove    = triggerRect.top

            // Abre hacia arriba solo si:
            // 1. No cabe abajo, Y
            // 2. Hay más espacio (o suficiente) arriba
            if (spaceBelow < contentHeight && spaceAbove > spaceBelow) {
                setDirection("up")
            } else {
                setDirection("down")
            }
        })

        return () => cancelAnimationFrame(frame)
    }, [open, triggerRef])

    if (!open) return null

    return (
        <div
            ref={contentRef}
            role="menu"
            className={`
                absolute
                z-50
                min-w-48
                border
                text-text
                p-2
                bg-white/80
                backdrop-blur-[1px]
                shadow-lg
                rounded-sm
                overflow-hidden
                hover:shadow-black/50
                transition-shadow
                duration-700
                ${direction === "up" ? "bottom-full mb-1" : "top-full mt-1"}
                ${className}
            `}
        >
            {children}
        </div>
    )
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export function DropdownItem({
    children,
    onClick,
    className = "",
}) {
    const { setOpen } = useContext(DropdownContext)

    const handleClick = (e) => {
        onClick?.(e)
        setOpen(false)
    }

    return (
        <button
            role="menuitem"
            onClick={handleClick}
            className={`w-full text-left px-3 py-2 rounded-sm text-[14px] hover:bg-gray-500
                hover:text-white focus:bg-gray-100 transition-colors ${className}`}
        >
            {children}
        </button>
    )
}