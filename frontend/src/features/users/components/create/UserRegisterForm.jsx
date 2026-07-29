import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocumentTypes } from "../../services/selectServices";
import useUserGroups from "../../hooks/useUserGroups";
import { Input, Button, StatusLabel, showAlert, cancelAlert, IconButton, usePermissions } from "@/shared";
import { UserTasksModal } from "@/features/tasks";
import { createTask } from "@/features/tasks/services/taskService";
import { userSchema } from "../../schemas/userSchema";
import { createUser } from "../../services/userService";
import { deriveRoleFlags } from "../../utils/userRoleUtils";
import UserForm from "../UserForm";
import { ClipboardList, Undo2 } from "lucide-react";

export default function UserRegisterForm() {

    const navigate = useNavigate();
    const [showTaskModal, setShowTaskModal] = useState(false);

    // Usa la misma convencion de nombres que el UserForm reutilizable.
    // `confirmEmail` y `userTasks` son extras propios de la creacion.
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        institutionalEmail: "",
        profilePicture: [],
        documentType: "",
        groups: "",
        documentNumber: "",
        startDate: "",
        endDate: "",
        additionalPhone: "",
        phone: "",
        address: "",
        isInstructorPlanta: false,
        userTasks: [],
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showAdditionalPhone, setShowAdditionalPhone] = useState(false);
    const [showEmailInst, setShowEmailInst] = useState(false);
    const { can, isAdmin } = usePermissions();
    // RFADMIN02: crear usuarios requiere el rol ADMIN/SADMIN y el permiso.
    const canCreateUsers = isAdmin && can("create_user");

    const [documentTypes, setDocumentTypes] = useState([]);
    useEffect(() => {
        getDocumentTypes()
            .then((types) => {
                // Ocultar la entrada duplicada "C.C" del formulario de creación.
                const filtered = types.filter((t) => t.label !== "C.C");
                setDocumentTypes(filtered);
            })
            .catch((err) =>
                showAlert({
                    icon: "error",
                    iconColor: "var(--color-error)",
                    title: "No se pudieron cargar los tipos de documento",
                    text: err.message,
                })
            );
    }, []);

    const { groups: userGroups } = useUserGroups();
    const availableGroups = userGroups.filter((group) => String(group.label || "").trim().toUpperCase() !== "SADMIN");

    useEffect(() => {
        // usePermissions lee sessionStorage sincrónicamente — canCreateUsers es
        // correcto desde el primer render, no hay race condition de carga async.
        if (!canCreateUsers) {
            showAlert({
                icon: "warning",
                iconColor: "var(--color-warning)",
                title: "Sin permisos",
                text: "No tienes permiso para crear usuarios.",
            });
            navigate("/usuarios");
        }
    }, [canCreateUsers, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "groups") {
            // Usar deriveRoleFlags con el nuevo valor para resetear isInstructorPlanta
            // si el grupo seleccionado deja de ser de tipo instructor.
            const { isInstructorRole } = deriveRoleFlags(userGroups, value);
            setFormData((prev) => ({
                ...prev,
                groups: value,
                isInstructorPlanta: isInstructorRole ? prev.isInstructorPlanta : false,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleProfileChange = (files) => {
        setFormData((prev) => ({ ...prev, profilePicture: files }));
    };

    const handleAddTask = (task) => {
        setFormData((prev) => ({ ...prev, userTasks: [...prev.userTasks, task] }));
    };

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Guardia de envío: protege incluso si se intenta enviar el formulario
        // antes de que la redirección reactiva haya terminado.
        if (!canCreateUsers) {
            await showAlert({
                icon: "warning",
                iconColor: "var(--color-warning)",
                title: "Sin permisos",
                text: "Solo los usuarios con rol ADMIN pueden crear usuarios.",
            });
            navigate("/usuarios");
            return;
        }

        // --- Fase 1: validación (síncrona, fuera del try de submit) ---
        const { isInstructorRole, isAdminLikeRole } = deriveRoleFlags(userGroups, formData.groups);
        const datesOptional = (formData.isInstructorPlanta && isInstructorRole) || isAdminLikeRole;

        const fieldErrors = {};

        if (!datesOptional) {
            if (!formData.startDate) fieldErrors.startDate = "Debe ingresar una fecha de inicio";
            if (!formData.endDate)   fieldErrors.endDate   = "Debe ingresar una fecha de finalización";
        }

        if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
            fieldErrors.endDate = "La fecha de finalización no puede ser anterior a la de inicio";
        }

        const result = userSchema.safeParse({
            ...formData,
            startDate: formData.startDate || "",
            endDate: formData.endDate || "",
        });

        if (!result.success) {
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (!(field in fieldErrors)) fieldErrors[field] = issue.message;
            });
        }

        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return;
        }

        // --- Fase 2: submit async — setSubmitting ANTES del try para que
        //     finally siempre lo resetee correctamente ---
        setErrors({});
        setSubmitting(true);

        try {
            const user = await createUser({
                ...result.data,
                // Fusionar campos que Zod puede omitir si son undefined/optional
                // o que no están declarados en el schema (userTasks).
                profilePicture: formData.profilePicture,
                userTasks: formData.userTasks,
            });

            // Persistir las tareas agregadas, asignandolas al usuario recien creado.
            // Se toman de formData (no de result.data) porque el schema de usuario
            // no declara userTasks y Zod descartaria esas keys.
            if (formData.userTasks.length) {
                try {
                    await Promise.all(
                        formData.userTasks.map((task) =>
                            createTask({ ...task, taskUser: String(user.id) })
                        )
                    );
                } catch (taskError) {
                    // El usuario ya fue creado — notificar sin bloquear la navegación.
                    await showAlert({
                        icon: "warning",
                        iconColor: "var(--color-warning)",
                        title: "Usuario creado, pero las tareas no se guardaron",
                        text: "El usuario fue creado correctamente. Puedes agregar las tareas manualmente desde su perfil.",
                    });
                    navigate("/usuarios");
                    return;
                }
            }

            // Alerta de exito con auto-cierre (4s) + barra de progreso y boton
            // "Aceptar" para cerrar manualmente.
            await showAlert({
                icon: "success",
                iconColor: "var(--color-success)",
                title: "Usuario creado exitosamente",
                timer: 4000,
            });
            navigate("/usuarios");

        } catch (error) {
            console.error("Error al crear usuario:", error);
            if (error.fieldErrors) setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
            // Los errores NO llevan timer: deben permanecer hasta que el usuario los lea y cierre.
            await showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al crear usuario", text: error.message });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

                <div className="flex items-center gap-3">
                    <IconButton onClick={() => navigate(-1)} variant="ghost">
                        <Undo2 size={20}/>
                    </IconButton>
                    <h2 className="text-primary">Registro de Usuarios</h2>
                </div>

                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <UserForm
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        onPhotoChange={handleProfileChange}
                        documentTypes={documentTypes}
                        groups={availableGroups}
                        singleGroupSelection
                        confirmEmailSlot={
                            <Input
                                label="Confirmar correo"
                                name="confirmEmail"
                                type="email"
                                placeholder="Confirma el correo electrónico"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                error={errors.confirmEmail}
                                required
                            />
                        }
                        contactExtraSlot={
                            // Telefono adicional: se muestra solo al presionar "Agregar número".
                            <div className="flex flex-col gap-2">
                                <StatusLabel optional>Teléfono adicional</StatusLabel>
                                {!showAdditionalPhone ? (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={() => setShowAdditionalPhone(true)}
                                    >
                                        Agregar número
                                    </Button>
                                ) : (
                                    <Input
                                        name="additionalPhone"
                                        placeholder="Número de teléfono adicional"
                                        value={formData.additionalPhone}
                                        onChange={handleChange}
                                        error={errors.additionalPhone}
                                    />
                                )}
                            </div>
                        }
                        emailInst={
                            // Correo institucional: se muestra solo al presionar "Agregar Correo Institucional"
                            <div className="flex flex-col gap-2">
                                <StatusLabel optional>Correo Institucional</StatusLabel>
                                {!showEmailInst ? (
                                  <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={() => setShowEmailInst(true)}
                                    >
                                        Agregar Correo Institucional
                                    </Button>
                                ) : (
                                    <Input
                                        name="institutionalEmail"
                                        type="email"
                                        optional
                                        placeholder="correo@sena.edu.co"
                                        onChange={handleChange}
                                        value={formData.institutionalEmail}
                                        error={errors.institutionalEmail}
                                    />
                                )}
                            </div>
                        }
                        systemExtraSlot={
                            // Tareas: se agregan en memoria y se persisten al crear el usuario.
                            <div className="flex flex-col gap-2">
                                <StatusLabel optional>Tareas</StatusLabel>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    className="flex gap-2 justify-center"
                                    onClick={() => setShowTaskModal(true)}
                                >
                                    <ClipboardList size={16} />
                                    Agregar tarea
                                </Button>

                                {/* Tareas ya agregadas */}
                                {formData.userTasks.map((task, i) => (
                                    <span key={i} className="text-small text-text-primary bg-surface-muted border border-border rounded-[var(--radius-full)] px-3 py-1 w-fit">
                                        {task.taskName}
                                    </span>
                                ))}
                            </div>
                        }
                    />
                    
                    <div className="flex gap-8 pb-6 justify-center md:justify-end md:pb-0">
                        <Button type="button" variant="secondary" size="md" onClick={handleCancel} disabled={submitting}>Cancelar</Button>
                        <Button type="submit" variant="primary" size="md" disabled={submitting}>
                            {submitting ? "Creando..." : "Crear"}
                        </Button>
                    </div>
                </form>

            </div>

            <UserTasksModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                pendingTasks={formData.userTasks}
                onAddPending={handleAddTask}
            />
        </>
    );
}
