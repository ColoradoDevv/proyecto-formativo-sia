export default function AccessCards({ className = "", Icon, label, value }) {
    return (
        <div className={`bg-white rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-text-muted shadow-md p-5 w-80 h-120 flex flex-col gap-3 ${className}`}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <span className="text-slate-800 text-2xl">
                        {Icon}
                    </span>
                )}
                <p className="text-sm font-bold text-slate-900 leading-tight">{label}</p>
            </div>
            <p className="text-2xl text-slate-600">{value}</p>
        </div>
    )
}
