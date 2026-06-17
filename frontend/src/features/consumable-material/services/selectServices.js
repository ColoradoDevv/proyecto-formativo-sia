import { apiFetch } from "@/shared/services/api";

export async function getBrands() {
    const response = await apiFetch("/api/products/brands/")
    const data = await response.json()
    return data.map((brand) => ({ id: brand.id, label: brand.name }))
}

export function getStates() {
    return Promise.resolve([
        { id: "Disponible",     label: "Disponible"     },
        { id: "No Disponible",  label: "No Disponible"  },
        { id: "Mantenimiento",  label: "Mantenimiento"  },
        { id: "Traslado",  label: "Traslado"  },
        { id: "En prestamo",    label: "En prestamo"    },
        { id: "Baja",           label: "Baja"           },
    ]);
}

export async function getUsers() {
    const response = await apiFetch("/api/users/")
    const data = await response.json()
    return data.map((user) => ({ id: user.id, label: `${user.first_name} ${user.last_name}` }))
}

export async function getCategories() {
    const response = await apiFetch("/api/products/categories/")
    const data = await response.json()
    return data.map((cat) => ({ id: cat.id, label: cat.name }))
}