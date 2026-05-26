export default function DetailCard({ title, children}) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface-hover">
            <h3 className="text-sm font-semibold border-b border-border pb-2">{title}</h3>
            <div className="grid grid-cols-2  sm:grid-cols-3 gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    );
}
