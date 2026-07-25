import { useNavigate } from "react-router-dom";


export default function AccessCards({ className = "", Icon, label, value, to }) {
    const navigate = useNavigate();

    return (
        <div className={`bg-surface-hover rounded-2xl cursor-pointer hover:shadow-(--shadow-elevation-3) shadow-(--shadow-elevation-2) p-5 w-full flex flex-col gap-3 ${className}`} onClick={() => navigate(to)}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <span className="text-text-primary text-h1">
                        {Icon}
                    </span>
                )}
                <p className="text-primary  text-text-primary leading-tight">{label}</p>
            </div>
            <div className="justify-items-center">
                <p className="text-primary text-text-secondary ">{value}</p>
            </div>
        </div>
    )
}
