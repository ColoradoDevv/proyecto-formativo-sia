export const loansReportConfig = {
    reportTitle: "Reporte de Préstamos",
    fileNamePrefix: "reporte-prestamos",
    fields: [
        { key: "usuario",          label: "Usuario",              default: true  },
        { key: "material",         label: "Material",             default: true  },
        { key: "cantidad",         label: "Cantidad",             default: true  },
        { key: "fecha_prestamo",   label: "Fecha de préstamo",    default: true  },
        { key: "fecha_devolucion", label: "Fecha de devolución",  default: true  },
        { key: "is_active",        label: "Estado",               default: false },
    ],
};
