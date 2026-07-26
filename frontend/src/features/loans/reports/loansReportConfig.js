export const loansReportConfig = {
    reportTitle: "Reporte de Préstamos",
    fileNamePrefix: "reporte-prestamos",
    fields: [
        { key: "usuario_responsable",         label: "Usuario Responsable",   default: true  },
        { key: "usuario_receptor", label: "Usuario Receptor", default: true },
        { key: "material",        label: "Material",             default: true  },
        { key: "amount_lent",     label: "Cantidad",             default: true  },
        { key: "loan_date",       label: "Fecha de préstamo",    default: true  },
        { key: "return_date",     label: "Fecha de devolución",  default: true  },
        { key: "is_active",       label: "Estado",               default: false },
    ],
};
