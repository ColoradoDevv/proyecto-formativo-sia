import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, StatusLabel, showAlert, cancelAlert } from "@/shared";
import { Undo2, ClipboardList } from "lucide-react";
import useUser from "../../hooks/useUser.js";
import useUserGroups from "../../hooks/useUserGroups";
import { getDocumentTypes } from "../../services/selectServices";
import { userEditSchema } from "../../schemas/userSchema";
import { updateUser } from "../../services/userService";
import { deriveRoleFlags } from "../../utils/userRoleUtils";
import { UserTasksModal } from "@/features/tasks";
import UserForm from "../UserForm";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

// Componente externo: maneja el fetch, loading y error
export default function UserEditView() {
    const { id } = useParams();
    const { user, loading, error } = useUser(id);

    const [documentTypes, setDocumentTypes] = useState([]);
    const { groups } = useUserGroups();
    // Excluir SADMIN igual que en la creación — ese rol no debe poder asignarse
    // desde la UI de gestión de usuarios.
    const availableGroups = groups.filter(
        (g) => String(g.label || "").trim().toUpperCase() !== "SADMIN"
    );

    useEffect(() => {
        getDocumentTypes()
            .then(setDocumentTypes)
            .catch((err) =>
                showAlert({
                    icon: "error",
                    iconColor: "var(--color-error)",
                    title: "No se pudieron cargar los tipos de documento",
                    text: err.message,
                })
            );
    }, []);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar usuario: {error.message}</p>;

    if (!user) return null;

    // key={id} desmonta y remonta UserEditForm al cambiar de usuario (navegación
    // directa entre /editar/1 y /editar/2). Es intencional: garantiza que el estado
    // del formulario se inicialice limpio con los datos del nuevo usuario sin necesidad
    // de sincronizar manualmente los efectos. La consecuencia aceptada es que los
    // cambios no guardados se pierden al cambiar de usuario.
    return <UserEditForm key={id} id={id} user={user} documentTypes={documentTypes} groups={availableGroups} allGroups={groups} />;
}

// Componente interno: recibe user ya cargado e inicializa el estado directamente
function UserEditForm({ id, user, documentTypes, groups, allGroups }) {
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
        groups:             user.groups && user.groups.length > 0 ? String(user.groups[0].id) : "",
        isActive:             user.is_active             != null ? String(user.is_active) : "true",
        deactivationReason:   user.deactivation_reason   ?? "",
        isInstructorPlanta:   user.is_instructor_planta  ?? false,
        startDate:            user.start_date            ?? "",
        endDate:              user.end_date              ?? "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    // Indica si la lista de grupos ya fue cargada al menos una vez.
    // Se usa como guardia para distinguir "grupos aún no disponibles" de
    // "el admin cambió el grupo activamente". Usar useState en lugar de useRef
    // evita el problema de StrictMode (React 18 monta→desmonta→monta en dev:
    // las refs persisten entre remontajes y pueden activar efectos prematuramente).
    const [groupsReady, setGroupsReady] = useState(false);

    // Derivar flags de rol desde el estado actual — fuente de verdad única.
    // Se usa allGroups (lista completa, incluye SADMIN) para que usuarios con ese
    // rol existente sean detectados correctamente. groups (availableGroups) es solo
    // para el select — excluye SADMIN para que no se pueda asignar desde la UI.
    const { isInstructorRole, isAdminLikeRole } = deriveRoleFlags(allGroups ?? groups, formData.groups);
    // Mientras groups no ha cargado, asumir opcional para evitar el flash donde
    // las fechas aparecen brevemente como requeridas antes de que llegue la lista.
    const datesOptional = groups.length === 0
        ? true
        : Boolean(formData.isInstructorPlanta && isInstructorRole) || isAdminLikeRole;

    // Efecto unificado de guardia: se dispara cuando cambia `groups` (carga async)
    // o `isInstructorRole` (el admin cambió el grupo en el form).
    // - Primera vez que llegan grupos: marca groupsReady y corrige datos corruptos.
    // - Siguientes ejecuciones: solo actúa si ya estaba listo (cambio activo del admin).
    useEffect(() => {
        if (groups.length === 0) return;
        if (!groupsReady) {
            setGroupsReady(true);
        }
        if (!isInstructorRole && formData.isInstructorPlanta) {
            setFormData(prev => ({ ...prev, isInstructorPlanta: false }));
        }
    }, [groups, isInstructorRole]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handlePhotoChange = (files) => {
        setFormData(prev => ({ ...prev, profilePicture: files }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validación manual del requerido de fechas, igual que en UserRegisterForm.
        // El schema acepta startDate vacío para soportar datesOptional, así que
        // este control previo es necesario cuando las fechas son requeridas.
        const preErrors = {};
        if (!datesOptional) {
            if (!formData.startDate) preErrors.startDate = "Debe ingresar una fecha de inicio";
            if (!formData.endDate)   preErrors.endDate   = "Debe ingresar una fecha de finalización";
        }
        if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
            preErrors.endDate = "La fecha de finalización no puede ser anterior a la de inicio";
        }
        if (user.is_active && formData.isActive === "false" && formData.deactivationReason.trim().length < 10) {
            preErrors.deactivationReason = "Debe indicar un motivo de inactivación de al menos 10 caracteres.";
        }
        if (Object.keys(preErrors).length) {
            setErrors(preErrors);
            return;
        }

        const result = userEditSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                // path puede ser ["field"] o ["field", index] para refines anidados.
                // Usamos el último segmento de string para cubrir ambos casos.
                const key = issue.path.findLast?.((p) => typeof p === "string") ?? issue.path[0];
                if (key !== undefined && !(key in fieldErrors)) {
                    fieldErrors[key] = issue.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            // result.data contiene los campos validados/transformados por Zod.
            // isInstructorPlanta no está en el schema (es un flag derivado del rol,
            // no un campo de validación independiente) — se fusiona manualmente.
            await updateUser(id, {
                ...result.data,
                // Campos fuera del schema o que Zod puede omitir si son optional/undefined.
                isInstructorPlanta: formData.isInstructorPlanta,
                deactivationReason: formData.deactivationReason,
                profilePicture: formData.profilePicture,
            });
            await showAlert({ icon: "success", iconColor: "var(--color-success)", title: "Usuario actualizado exitosamente" });
            navigate(-1);
        } catch (error) {
            if (error.partialSuccess) {
                // El PATCH principal funcionó pero la sincronización de grupos falló.
                // Navegamos de todas formas porque los datos básicos sí se guardaron.
                await showAlert({
                    icon: "warning",
                    iconColor: "var(--color-warning)",
                    title: "Guardado parcial",
                    text: error.message,
                });
                navigate(-1);
                return;
            }
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            await showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al actualizar usuario", text: error.message });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={20}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Editar Usuario</h2>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                <UserForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onPhotoChange={handlePhotoChange}
                    documentTypes={documentTypes}
                    groups={groups}
                    isInstructorRole={isInstructorRole}
                    datesOptional={datesOptional}
                    showStatus
                    singleGroupSelection
                    contactExtraSlot={
                        <Input
                            label="Teléfono adicional"
                            name="additionalPhone"
                            placeholder="Número adicional (opcional)"
                            value={formData.additionalPhone}
                            onChange={handleChange}
                            error={errors.additionalPhone}
                        />
                    }
                    systemExtraSlot={
                        <div className="flex flex-col gap-3">
                            {user.is_active && formData.isActive === "false" && (
                                <Input
                                    label="Motivo de inactivación"
                                    name="deactivationReason"
                                    placeholder="Indique el motivo de la inactivación"
                                    value={formData.deactivationReason}
                                    onChange={handleChange}
                                    error={errors.deactivationReason}
                                    required
                                />
                            )}
                            {/* Tareas del usuario: abre el modal con las tareas reales (BD) */}
                            <div className="flex flex-col gap-2">
                                <StatusLabel>Tareas</StatusLabel>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    className="flex gap-2 justify-center"
                                    onClick={() => setShowTaskModal(true)}
                                >
                                    <ClipboardList size={16} />
                                    Ver / agregar tareas
                                </Button>
                            </div>
                        </div>
                    }
                />

                <div className="flex gap-8 pb-6 justify-center md:justify-end md:pb-0">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md" disabled={submitting}>
                        {submitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>

            </form>

            <UserTasksModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                userId={id}
            />

        </div>
    );
}
