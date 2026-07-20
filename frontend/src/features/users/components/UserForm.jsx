import { Input, Select, SelectMultiple, ProfileFileInput, StatusBadge, EditCard, IconButton, showAlert, promptAlert } from "@/shared";
import { Plus } from "lucide-react";


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
    onCreateGroup = null,
    showStatus = false,
    confirmEmailSlot = null,
    contactExtraSlot = null,
    systemExtraSlot = null,
}) {
    const isActive = formData.isActive === "true" || formData.isActive === true;

    // Pide el nombre del nuevo grupo, lo crea en el backend y lo selecciona
    // automáticamente en el SelectMultiple. `onCreateGroup` es responsabilidad
    // de la página (crea el grupo y actualiza la lista de opciones).
    const handleCreateGroup = async () => {
        if (!onCreateGroup) return;

        const result = await promptAlert({
            title: "Nuevo grupo",
            inputLabel: "Nombre del grupo",
            inputPlaceholder: "Ej. Administradores",
            confirmText: "Crear",
            cancelText: "Cancelar",
            inputValidator: (value) => {
                if (!value || !value.trim()) return "El nombre del grupo es obligatorio";
            },
        });

        if (!result.isConfirmed) return;

        try {
            const newGroup = await onCreateGroup(result.value.trim());
            onChange({ target: { name: "groups", value: [...formData.groups, String(newGroup.id)] } });
        } catch (error) {
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "No se pudo crear el grupo", text: error.message });
        }
    };

    return (
        <>
            {/* Información Personal — foto lateral + campos */}
            <EditCard title="Información Personal" cols={1}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                    {/* Foto + estado */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <ProfileFileInput
                            className="w-24 h-24 rounded-[var(--radius-xl)]"
                            value={formData.profilePicture}
                            onChange={onPhotoChange}
                            error={errors.profilePicture}
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
                    <div>
                        <SelectMultiple
                            label="Tipo de usuario"
                            name="groups"
                            options={groups}
                            value={formData.groups}
                            onChange={onChange}
                            error={errors.groups}
                            required
                            labelAction={
                                onCreateGroup && (
                                    <IconButton
                                        type="button"
                                        variant="ghost"
                                        hitSize={28}
                                        iconSize={16}
                                        ariaLabel="Agregar nuevo grupo"
                                        onClick={handleCreateGroup}
                                    >
                                        <Plus size={16} />
                                    </IconButton>
                                )
                            }
                        />
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
                    <Input
                        label="Fecha de inicio"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={onChange}
                        error={errors.startDate}
                        required
                    />
                    <Input
                        label="Fecha de finalización"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={onChange}
                        error={errors.endDate}
                    />
                    {systemExtraSlot}
                </EditCard>
            </div>
        </>
    );
}
