import { useEffect, useState } from "react"
import AccessCards from "../components/AccessCards"
import QuickActions from "../components/QuickActions"
import RecentActivity from "../components/RecentActivity"
import { Wrench, Package, ClipboardList, Users } from "lucide-react"
import { getUsers } from "@/features/users/services/userService"
import { getStoredUser } from "@/shared/services/api"
import { getCM } from "@/features/consumable-material/services/consumableService"
import { getRMs } from "@/features/returnable-material/services/returnableService"
import { getLoans } from "@/features/loans/services/loanService"
import { usePermissions } from "@/shared/hooks/usePermissions"

export default function DashboardLayout() {
    const { canAny } = usePermissions()

    // Permisos reales en BD (0002) + codenames nuevos (0004)
    const canSeeUsers       = canAny(["list_users", "view_user"])
    const canSeeConsumables = canAny(["list_consumable_materials", "view_consumable_material", "view_consumable"])
    const canSeeReturnables = canAny(["list_returnable_materials", "view_returnable_material", "view_returnable"])
    const canSeeLoans       = canAny(["list_loans", "view_loan"])

    const [userCount,       setUserCount]       = useState(0)
    const [consumableCount, setConsumableCount] = useState(0)
    const [returnableCount, setReturnableCount] = useState(0)
    const [loansCount,      setLoansCount]      = useState(0)

    useEffect(() => {
        if (!canSeeUsers) return
        getUsers().then(data => setUserCount(data.length)).catch(() => setUserCount(0))
    }, [canSeeUsers])

    useEffect(() => {
        if (!canSeeConsumables) return
        getCM().then(data => setConsumableCount(data.length)).catch(() => setConsumableCount(0))
    }, [canSeeConsumables])

    useEffect(() => {
        if (!canSeeReturnables) return
        getRMs().then(data => setReturnableCount(data.length)).catch(() => setReturnableCount(0))
    }, [canSeeReturnables])

    useEffect(() => {
        if (!canSeeLoans) return
        getLoans().then(data => setLoansCount(data.length)).catch(() => setLoansCount(0))
    }, [canSeeLoans])

    const userName = getStoredUser()?.first_name

    const now = new Date()
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`
    const hour = now.getHours()
    const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"

    const cards = []
    if (canSeeUsers) {
        cards.push({
            label: "Usuarios registrados",
            Icon: <Users />,
            value: userCount,
            to: "/usuarios",
        })
    }
    if (canSeeConsumables) {
        cards.push({
            label: "Materiales consumibles",
            Icon: <Wrench />,
            value: consumableCount,
            to: "/consumibles",
        })
    }
    if (canSeeReturnables) {
        cards.push({
            label: "Materiales devolutivos",
            Icon: <Package />,
            value: returnableCount,
            to: "/devolutivos",
        })
    }
    if (canSeeLoans) {
        cards.push({
            label: "Préstamos registrados",
            Icon: <ClipboardList />,
            value: loansCount,
            to: "/prestamos",
        })
    }

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <p className="text-text-primary uppercase tracking-widest font-medium">
                    Panel de control / {formattedDate}
                </p>
                <h2 className="text-h1 text-text-primary font-heading">
                    {greeting}, {userName}.
                </h2>
                <p className="text-body text-text-secondary">
                    Bienvenido al Sistema de Gestión de Inventario. Aquí tienes un resumen de tu operación.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <AccessCards
                        key={card.to}
                        Icon={card.Icon}
                        label={card.label}
                        value={card.value}
                        to={card.to}
                        isFeatured={index === 0}
                        className={`[animation-delay:${index * 60}ms]`}
                    />
                ))}
            </div>

            <QuickActions />
            <RecentActivity />
        </div>
    )
}
