const FIXED_CATEGORY_NAMES = [
    "Herramientas",
    "Maquinaria y Equipos",
    "Muebles y Enseres",
];

export function getReturnableCategoryOptions(categories = []) {
    // Devuelve todas las categorías disponibles (sin filtrar).
    // La validación de reglas por categoría se aplica según el nombre en la validación.
    return categories;
}

export function getReturnableCategoryRules(categoryName = "") {
    const normalized = String(categoryName || "").trim().toLowerCase();

    if (normalized === "herramientas") {
        return {
            requiresSenaPlate: false,
            requiresId: false,
            requiresDimensions: false,
        };
    }

    if (normalized === "maquinaria y equipos") {
        return {
            requiresSenaPlate: true,
            requiresId: true,
            requiresDimensions: false,
        };
    }

    if (normalized === "muebles y enseres") {
        return {
            requiresSenaPlate: true,
            requiresId: true,
            requiresDimensions: true,
        };
    }

    // Para cualquier otra categoría no reconocida, defaults permisivos
    return {
        requiresSenaPlate: false,
        requiresId: false,
        requiresDimensions: false,
    };
}
