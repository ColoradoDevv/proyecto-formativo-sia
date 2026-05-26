export function buildReportDataset({ data, selectedFields, scope = "all", filterValue = "" }) {
    let records = [...data];

    if (scope !== "all" && filterValue.trim()) {
        const q = filterValue.trim().toLowerCase();
        records = records.filter((item) =>
            Object.values(item).some((v) =>
                String(v ?? "").toLowerCase().includes(q)
            )
        );
    }

    // Preserve the original field order
    const orderedFields = selectedFields.slice().sort((a, b) => {
        const ia = data.length ? Object.keys(data[0]).indexOf(a.key) : 0;
        const ib = data.length ? Object.keys(data[0]).indexOf(b.key) : 0;
        return ia - ib;
    });

    const headers = orderedFields.map((f) => f.label);

    const rows = records.map((item) =>
        orderedFields.map((field) => {
            const value = field.accessor ? field.accessor(item) : item[field.key];
            if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
            if (value === null || value === undefined) return "-";
            return String(value);
        })
    );

    return { headers, rows };
}
