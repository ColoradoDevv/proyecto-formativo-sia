import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocumentTypes, getUserGroups } from "../../services/selectServices";
import { Input, Button, StatusLabel, showAlert, cancelAlert } from "@/shared";
import { UserTasksModal } from "@/features/tasks";
import { createTask } from "@/features/tasks/services/taskService";
import { userSchema } from "../../schemas/userSchema";
import { createUser } from "../../services/userService";
import UserForm from "../UserForm";
import { Plus, ClipboardList } from "lucide-react";

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
        groups: [],
        documentNumber: "",
        startDate: "",
        endDate: "",
        additionalPhone: "",
        phone: "",
        address: "",
        userTasks: [],
    });

    const [errors, setErrors] = useState({});
    const [showAdditionalPhone, setShowAdditionalPhone] = useState(false);

    const [documentTypes, setDocumentTypes] = useState([]);
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
    }, []);

    const [userGroups, setUserGroups] = useState([]);
    useEffect(() => {
        getUserGroups().then(setUserGroups);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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

        try {
            const result = userSchema.safeParse(formData);

            if (!result.success) {
                const fieldErrors = {};
                result.error.issues.forEach((issue) => {
                    const field = issue.path[0];
                    fieldErrors[field] = issue.message;
                });
                setErrors(fieldErrors);
                return;
            }

            setErrors({});

            const user = await createUser(result.data);

            // Persistir las tareas agregadas, asignandolas al usuario recien creado.
            // Se toman de formData (no de result.data) porque el schema de usuario
            // no declara userTasks y Zod descartaria esas keys.
            if (formData.userTasks.length) {
                await Promise.all(
                    formData.userTasks.map((task) =>
                        createTask({ ...task, taskUser: String(user.id) })
                    )
                );
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
            showAlert({ icon: "error", iconColor: "var(--color-error)", title: "Error al crear usuario", text: error.message });
        }
    }

    return (
        <>
            <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

                <div>
                    <h2 className="text-primary">Registro de Usuarios</h2>
                    <p className="text-small text-text-muted">
                        Registra un usuario con los datos correspondientes.
                    </p>
                </div>

                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <UserForm
                        formData={formData}
                        errors={errors}
                        onChange={handleChange}
                        onPhotoChange={handleProfileChange}
                        documentTypes={documentTypes}
                        groups={userGroups}
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
                                <StatusLabel>Teléfono adicional (opcional)</StatusLabel>
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
                        systemExtraSlot={
                            // Tareas: se agregan en memoria y se persisten al crear el usuario.
                            <div className="flex flex-col gap-2">
                                <StatusLabel>Tareas (opcional)</StatusLabel>
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

                    <div className="flex gap-4 justify-center md:justify-end">
                        <Button type="button" variant="secondary" size="md" onClick={handleCancel}>Cancelar</Button>
                        <Button type="submit" variant="primary" size="md">Crear</Button>
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
