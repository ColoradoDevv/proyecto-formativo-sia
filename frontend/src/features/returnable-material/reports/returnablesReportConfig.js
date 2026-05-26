export const returnablesReportConfig = {
    reportTitle: "Reporte de Materiales Devolutivos",
    fileNamePrefix: "reporte-devolutivos",
    fields: [
        { key: "rm_sena_plate",    label: "Placa SENA",      default: true  },
        { key: "rm_name",          label: "Nombre",           default: true  },
        { key: "rm_brand",         label: "Marca",            default: true  },
        { key: "rm_category",      label: "Categoría",        default: true  },
        { key: "rm_serial",        label: "Serial",           default: true  },
        { key: "rm_state",         label: "Estado",           default: true  },
        { key: "rm_quantity",      label: "Cantidad",         default: false },
        { key: "rm_unit_value",    label: "Valor unitario",   default: false },
        { key: "rm_total_value",   label: "Valor total",      default: false },
        { key: "is_active",        label: "Activo",           default: false },
    ],
};
