import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, SelectInputMultiple, ProfileFileInput, StatusBadge, showAlert, cancelAlert, EditCard } from "@/shared";
import { Undo2 } from "lucide-react";
import useUser from "../../hooks/useUser.js";
import { getDocumentTypes, getUserGroups } from "../../services/selectServices";
import { userEditSchema } from "../../schemas/userSchema";
import { updateUser } from "../../services/userService";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

const STATUS_OPTIONS = [
    { id: "true",  label: "Activo"   },
    { id: "false", label: "Inactivo" },
];

// Componente externo: maneja el fetch, loading y error
export default function UserEditView() {
    const { id } = useParams();
    const { user, loading, error } = useUser(id);

    const [documentTypes, setDocumentTypes] = useState([]);
    const [groups,        setGroups]        = useState([]);

    useEffect(() => { getDocumentTypes().then(setDocumentTypes); }, []);
    useEffect(() => { getUserGroups().then(setGroups);           }, []);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar usuario: {error.message}</p>;

    return <UserEditForm id={id} user={user} documentTypes={documentTypes} groups={groups} />;
}

// Componente interno: recibe user ya cargado e inicializa el estado directamente
function UserEditForm({ id, user, documentTypes, groups }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        profilePicture:     user.profile_picture ? [user.profile_picture] : [],
        firstName:          user.first_name          ?? "",
        lastName:           user.last_name           ?? "",
        email:              user.email               ?? "",
        institutionalEmail: user.institutional_email ?? "",
        phone:              user.phone_number        ?? "",
        additionalPhone:    user.second_phone_number ?? "",
        address:            user.address             ?? "",
        documentType:       user.document_type?.id   != null ? String(user.document_type.id) : "",
        documentNumber:     user.document_number     ?? "",
        groups:             user.groups && user.groups.length > 0 ? user.groups.map(g => String(g.id)) : [],
        isActive:           user.is_active           != null ? String(user.is_active)          : "true",
        startDate:          user.start_date          ?? "",
        endDate:            user.end_date            ?? "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (files) => {
        setFormData(prev => ({ ...prev, profilePicture: files }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const result = userEditSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            await updateUser(id, formData);
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Usuario actualizado exitosamente" });
            navigate(-1);
        } catch (error) {
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar usuario", text: error.message });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    const isActive = formData.isActive === "true";

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Editar Usuario</h2>
                    <p className="text-small text-text-muted">Modifica la información del usuario.</p>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                {/* Información Personal — foto lateral + campos */}
                <EditCard title="Información Personal" cols={1}>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* Foto + estado */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <ProfileFileInput
                                className="w-24 h-24 rounded-[var(--radius-xl)]"
                                value={formData.profilePicture}
                                onChange={handlePhotoChange}
                            />
                            <StatusBadge active={isActive} />
                        </div>

                        {/* Campos personales */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                            <Input
                                label="Nombres"
                                name="firstName"
                                placeholder="Ingresa el nombre"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                required
                            />
                            <Input
                                label="Apellidos"
                                name="lastName"
                                placeholder="Ingresa los apellidos"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                required
                            />
                            <SelectInput
                                label="Tipo de documento"
                                name="documentType"
                                options={documentTypes}
                                value={formData.documentType}
                                onChange={handleChange}
                                error={errors.documentType}
                                required
                            />
                            <Input
                                label="Número de documento"
                                name="documentNumber"
                                placeholder="Ingresa el número"
                                value={formData.documentNumber}
                                onChange={handleChange}
                                error={errors.documentNumber}
                                required
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Dirección"
                                    name="address"
                                    placeholder="Ingresa la dirección"
                                    value={formData.address}
                                    onChange={handleChange}
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
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                        <Input
                            label="Correo institucional"
                            name="institutionalEmail"
                            type="email"
                            placeholder="correo@sena.edu.co"
                            value={formData.institutionalEmail}
                            onChange={handleChange}
                            error={errors.institutionalEmail}
                        />
                        <Input
                            label="Teléfono"
                            name="phone"
                            placeholder="Número de teléfono"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            required
                        />
                        <Input
                            label="Teléfono adicional"
                            name="additionalPhone"
                            placeholder="Número adicional (opcional)"
                            value={formData.additionalPhone}
                            onChange={handleChange}
                            error={errors.additionalPhone}
                        />
                    </EditCard>

                    <EditCard title="Información del Sistema">
                        <SelectInputMultiple
                            label="Tipo de usuario"
                            name="groups"
                            options={groups}
                            value={formData.groups}
                            onChange={handleChange}
                            error={errors.groups}
                            required
                        />
                        <SelectInput
                            label="Estado"
                            name="isActive"
                            options={STATUS_OPTIONS}
                            value={formData.isActive}
                            onChange={handleChange}
                            error={errors.isActive}
                            required
                        />
                        <Input
                            label="Fecha de inicio"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={errors.startDate}
                            required
                        />
                        <Input
                            label="Fecha de finalización"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            error={errors.endDate}
                        />
                    </EditCard>

                </div>

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md" disabled={submitting}>
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>

            </form>

        </div>
    );
}
