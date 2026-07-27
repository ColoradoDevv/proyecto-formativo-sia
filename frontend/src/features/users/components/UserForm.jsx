import { Input, Select, SelectMultiple, ProfileFileInput, StatusBadge, EditCard, Checkbox } from "@/shared";


const STATUS_OPTIONS = [
    { id: "true",  label: "Activo"   },
    { id: "false", label: "Inactivo" },
];

// Formulario de campos de usuario, reutilizable entre crear y editar.
// Es PRESENTACIONAL: no maneja estado ni submit — recibe formData/errors y los
// handlers desde la pagina. Usa una unica convencion de nombres de campo.
//
// Props:
// - formData, errors, onChange, onPhotoChange
// - documentTypes, groups: opciones para los selects
// - showStatus: muestra el selector "Estado" (solo en editar)
// - confirmEmailSlot / contactExtraSlot / systemExtraSlot: slots opcionales para
//   inyectar campos propios de cada modo (confirmar correo, telefono adicional
//   condicional, tareas, etc.)
export default function UserForm({
    formData,
    errors = {},
    onChange,
    onPhotoChange,
    documentTypes = [],
    groups = [],
    showStatus = false,
    singleGroupSelection = false,
    disabledOptionValues = [],
    // Flags de rol pre-calculados por el padre (Opción A).
    // Si no se reciben, se calculan aquí como fallback para compatibilidad
    // con formularios que aún no los derivan externamente (ej. UserCreateForm).
    isInstructorRole: isInstructorRoleProp = null,
    datesOptional: datesOptionalProp = null,
    confirmEmailSlot = null,
    contactExtraSlot = null,
    systemExtraSlot = null,
}) {
    const isActive = formData.isActive === "true" || formData.isActive === true;

    // Si el padre ya calculó los flags, usarlos directamente.
    // Si no (fallback), derivarlos localmente con la misma lógica.
    let isInstructorRole, datesOptional;
    if (isInstructorRoleProp !== null && datesOptionalProp !== null) {
        isInstructorRole = isInstructorRoleProp;
        datesOptional    = datesOptionalProp;
    } else {
        const selectedGroupIds = Array.isArray(formData.groups)
            ? formData.groups.map(String)
            : formData.groups ? [String(formData.groups)] : [];
        const selectedGroupNames = groups
            .filter((g) => selectedGroupIds.includes(String(g.id)))
            .map((g) => g.label?.toUpperCase?.() ?? "");
        isInstructorRole = selectedGroupNames.some(
            (n) => n.includes("INST") || n.includes("INSTRUCTOR")
        );
        const isAdminLikeRole = selectedGroupNames.some((n) => /(ADMIN|SADMIN|SUPER)/.test(n));
        datesOptional = Boolean(formData.isInstructorPlanta && isInstructorRole) || isAdminLikeRole;
    }

    return (
        <>
            {/* Información Personal — foto lateral + campos */}
            <EditCard title="Información Personal" cols={1}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                    {/* Foto + estado */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <ProfileFileInput
                            className="w-32 h-40 rounded-[var(--radius-xl)]"
                            value={formData.profilePicture}
                            onChange={onPhotoChange}
                            error={errors.profilePicture}
                            label="Foto de perfil"
                            optional
                            description="Formato JPG o PNG. Tamaño máximo: 2MB."
                        />
                        {showStatus && <StatusBadge active={isActive} />}
                    </div>

                    {/* Campos personales */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                        <Input
                            label="Nombres"
                            name="firstName"
                            placeholder="Ingresa el nombre"
                            value={formData.firstName}
                            onChange={onChange}
                            error={errors.firstName}
                            required
                        />
                        <Input
                            label="Apellidos"
                            name="lastName"
                            placeholder="Ingresa los apellidos"
                            value={formData.lastName}
                            onChange={onChange}
                            error={errors.lastName}
                            required
                        />
                        <Select
                            label="Tipo de documento"
                            name="documentType"
                            options={documentTypes}
                            value={formData.documentType}
                            onChange={onChange}
                            error={errors.documentType}
                            required
                        />
                        <Input
                            label="Número de documento"
                            name="documentNumber"
                            placeholder="Ingresa el número"
                            value={formData.documentNumber}
                            onChange={onChange}
                            error={errors.documentNumber}
                            required
                        />
                        <div className="sm:col-span-2">
                            <Input
                                label="Dirección"
                                name="address"
                                placeholder="Ingresa la dirección"
                                value={formData.address}
                                onChange={onChange}
                                error={errors.address}
                                required
                            />
                        </div>
                    </div>
                </div>
            </EditCard>

            {/* Contacto y Sistema lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <EditCard title="Información de Contacto">
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={onChange}
                        error={errors.email}
                        required
                    />
                    {confirmEmailSlot}
                    <Input
                        label="Correo institucional"
                        name="institutionalEmail"
                        type="email"
                        optional
                        placeholder="correo@sena.edu.co"
                        value={formData.institutionalEmail}
                        onChange={onChange}
                        error={errors.institutionalEmail}
                    />
                    <Input
                        label="Teléfono"
                        name="phone"
                        placeholder="Número de teléfono"
                        value={formData.phone}
                        onChange={onChange}
                        error={errors.phone}
                        required
                    />
                    {contactExtraSlot}
                </EditCard>

                <EditCard title="Información del Sistema">
                    <Input
                        label="Fecha de inicio"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={onChange}
                        error={errors.startDate}
                        required={!datesOptional}
                        optional={datesOptional}
                    />
                    <Input
                        label="Fecha de finalización"
                        name="endDate"
                        type="date"
                        required={!datesOptional}
                        optional={datesOptional}
                        value={formData.endDate}
                        onChange={onChange}
                        error={errors.endDate}
                    />
                    <div>
                        {singleGroupSelection ? (
                            <Select
                                label="Tipo de usuario"
                                name="groups"
                                options={groups}
                                value={formData.groups}
                                onChange={onChange}
                                error={errors.groups}
                                required
                                disabledOptionValues={disabledOptionValues}
                            />
                        ) : (
                            <SelectMultiple
                                label="Tipo de usuario"
                                name="groups"
                                options={groups}
                                value={formData.groups}
                                onChange={onChange}
                                error={errors.groups}
                                required
                                disabledOptionValues={disabledOptionValues}
                            />
                        )}
                        {isInstructorRole && (
                            <div className="mt-2">
                                <Checkbox
                                    id="isInstructorPlanta"
                                    name="isInstructorPlanta"
                                    label="Instructor de planta"
                                    checked={Boolean(formData.isInstructorPlanta)}
                                    onChange={onChange}
                                />
                            </div>
                        )}
                        {showStatus && (
                            <Select
                                label="Estado"
                                name="isActive"
                                options={STATUS_OPTIONS}
                                value={formData.isActive}
                                onChange={onChange}
                                error={errors.isActive}
                                required
                            />
                        )}
                    </div>


                    {systemExtraSlot}
                </EditCard>
            </div>
        </>
    );
}
