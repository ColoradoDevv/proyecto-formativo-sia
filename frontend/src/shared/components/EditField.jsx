export default function EditField({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? "sm:col-span-2 " : ""}>
            <p className="text-caption text-text-primary uppercase tracking-wide">{label}</p>
            <p className="text-text-secondary text-small mt-1">
                {value ?? <span className="italic text-text-muted">No registrado</span>}
            </p>
        </div>
    );
}
