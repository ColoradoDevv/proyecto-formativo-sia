export const consumablesReportConfig = {
    reportTitle: "Reporte de Materiales de Consumo",
    fileNamePrefix: "reporte-consumibles",
    fields: [
        { key: "cm_sena_plate",  label: "Placa SENA",      default: true  },
        { key: "cm_name",        label: "Nombre",           default: true  },
        { key: "cm_brand",       label: "Marca",            default: true  },
        { key: "cm_state",       label: "Estado",           default: true  },
        { key: "cm_quantity",    label: "Cantidad",         default: true  },
        { key: "cm_unit_value",  label: "Valor unitario",   default: false },
        { key: "cm_total_value", label: "Valor total",      default: false },
        { key: "cm_location",    label: "Ubicación",        default: false },
        { key: "cm_description", label: "Descripción",      default: false },
        { key: "is_active",      label: "Activo",           default: false },
    ],
};
