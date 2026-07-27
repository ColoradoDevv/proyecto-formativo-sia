export const tasksReportConfig = {
    reportTitle:    "Reporte de Tareas",
    fileNamePrefix: "reporte-tareas",
    fields: [
        { key: "id",          label: "ID",                default: true  },
        { key: "name",        label: "Título",            default: true  },
        { key: "user_name",   label: "Usuario asignado",  default: true  },
        { key: "start_date",  label: "Fecha inicio",      default: true  },
        { key: "end_date",    label: "Fecha fin",         default: true  },
        { key: "state",       label: "Estado",            default: true  },
        { key: "description", label: "Descripción",       default: false },
    ],
};
