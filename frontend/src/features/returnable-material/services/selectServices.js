import { apiFetch } from "@/shared/services/api";

export async function getBrands() {
    const response = await apiFetch("/api/products/brands/");
    const data = await response.json();
    return data.filter((brand) => brand.is_active).map((brand) => ({ id: brand.id, label: brand.name }));
}

// Crea una marca nueva desde el formulario y la devuelve como opcion {id,label}.
export async function createBrand(name) {
    const response = await apiFetch("/api/products/brands/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.name?.[0] || data.detail || "No se pudo crear la marca");
    }
    const brand = await response.json();
    return { id: brand.id, label: brand.name };
}

export async function getCategories() {
    const response = await apiFetch("/api/products/categories/");
    const data = await response.json();
    return data.map((cat) => ({ id: cat.id, label: cat.name }));
}

// Crea una categoria nueva desde el formulario y la devuelve como opcion {id,label}.
export async function createCategory(name) {
    const response = await apiFetch("/api/products/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.name?.[0] || data.detail || "No se pudo crear la categoría");
    }
    const cat = await response.json();
    return { id: cat.id, label: cat.name };
}

export function getStates() {
    return Promise.resolve([
        { id: "Disponible",    label: "Disponible"    },
        { id: "No Disponible", label: "No Disponible" },
        { id: "Mantenimiento", label: "Mantenimiento" },
        { id: "Traslado",      label: "Traslado"      },
        { id: "En prestamo",   label: "En prestamo"   },
        { id: "Baja",          label: "Baja"          },
    ]);
}
