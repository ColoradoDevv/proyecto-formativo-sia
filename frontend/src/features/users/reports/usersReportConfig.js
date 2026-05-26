export const usersReportConfig = {
    reportTitle: "Reporte de Usuarios",
    fileNamePrefix: "reporte-usuarios",
    fields: [
        { key: "name",              label: "Nombre",                default: true  },
        { key: "documentType",      label: "Tipo de documento",     default: true  },
        { key: "documentNumber",    label: "Número de documento",   default: true  },
        { key: "role",              label: "Rol",                   default: true  },
        { key: "email",             label: "Correo personal",       default: true  },
        { key: "institutionalEmail",label: "Correo institucional",  default: false },
        { key: "phone",             label: "Teléfono",              default: false },
        { key: "additionalPhone",   label: "Teléfono adicional",    default: false },
        { key: "addres",            label: "Dirección",             default: false },
        { key: "startDate",         label: "Fecha inicio",          default: false },
        { key: "endDate",           label: "Fecha fin",             default: false },
        { key: "is_active",         label: "Estado",                default: true  },
    ],
};
