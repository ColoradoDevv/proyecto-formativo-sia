import { useEffect, useState } from "react"
import AccessCards from "../components/AccessCards"
import { Wrench, Package, ClipboardList, Users } from "lucide-react"
import { getUsers } from "@/features/users/services/userService"
import { getStoredUser } from "@/shared/services/api"
import { getCM } from "@/features/consumable-material/services/consumableService"
import { getRMs } from "@/features/returnable-material/services/returnableService"
import { getLoans } from "@/features/loans/services/loanService"

export default function HomeLayout(){

    // Estado para contar cantidad de usuarios
    const [userCount, setUserCount] = useState(0)

    useEffect(() => {
        getUsers()
            .then(data => setUserCount(data.length))
            .catch(() => setUserCount(0))
    }, [])

    // Estado para contar cantidad de materiales consumibles
    const [consumableCount, setConsumableCount] = useState(0)

    useEffect(() => {
        getCM()
            .then(data => setConsumableCount(data.length))
            .catch(() => setConsumableCount(0))
    }, [])

    // Estado para contar cantidad de materiales consumibles
    const [returnableCount, setReturnableCount] = useState(0)

    useEffect(() => {
        getRMs()
            .then(data => setReturnableCount(data.length))
            .catch(() => setReturnableCount(0))
    }, [])

        // Estado para contar cantidad de materiales consumibles
    const [loansCount, setLoansCount] = useState(0)

    useEffect(() => {
        getLoans()
            .then(data => setLoansCount(data.length))
            .catch(() => setLoansCount(0))
    }, [])

    const userPlaceholder = getStoredUser()?.first_name

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-6">
            <div>
                <h2 className="text-h3">¡Hola!  {userPlaceholder}.</h2>
                <p className="text-small text-text-muted">Bienvenido al Sistema de Gestion Inventario.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AccessCards
                    label="Usuarios Registrados"
                    Icon={<Users />}
                    value={userCount}
                    to="/usuarios"
                    />
                <AccessCards
                    Icon={<Wrench />}
                    label="Materiales consumibles"
                    value={consumableCount}
                    to="/consumibles"
                    />
                <AccessCards
                    Icon={<Package />}
                    label="Materiales Devolutivos"
                    value={returnableCount}
                    to="/devolutivos"
                    />
                <AccessCards
                    Icon={<ClipboardList />}
                    label="Prestamos Registrados"
                    value={loansCount}
                    to="/prestamos"
                />
            </div>
        </div>
    )
}