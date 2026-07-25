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

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6">
            <div>
                <h2 className="text-h3 text-text-primary">¡Hola! {userName}.</h2>
                <p className="text-small text-text-muted">Bienvenido al Sistema de Gestion Inventario SIA.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {canSeeUsers && (
                    <AccessCards
                        label="Usuarios Registrados"
                        Icon={<Users />}
                        value={userCount}
                        to="/usuarios"
                    />
                )}
                {canSeeConsumables && (
                    <AccessCards
                        Icon={<Wrench />}
                        label="Materiales consumibles"
                        value={consumableCount}
                        to="/consumibles"
                    />
                )}
                {canSeeReturnables && (
                    <AccessCards
                        Icon={<Package />}
                        label="Materiales Devolutivos"
                        value={returnableCount}
                        to="/devolutivos"
                    />
                )}
                {canSeeLoans && (
                    <AccessCards
                        Icon={<ClipboardList />}
                        label="Prestamos Registrados"
                        value={loansCount}
                        to="/prestamos"
                    />
                )}
            </div>

            <QuickActions />

            <RecentActivity />
        </div>
    )
}
