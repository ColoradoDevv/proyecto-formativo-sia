export default function DetailField({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? "sm:col-span-2 " : ""}>
            <p className="text-xs text-text-primary uppercase tracking-wide">{label}</p>
            <p className="text-text-secondary text-sm mt-1">
                {value ?? <span className="italic text-text-muted">No registrado</span>}
            </p>
        </div>
    );
}
