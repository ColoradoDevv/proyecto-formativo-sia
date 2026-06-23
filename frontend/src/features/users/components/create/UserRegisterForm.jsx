import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocumentTypes, getUserGroups} from "../../services/selectServices";
import {Input, Button, SelectInput, SelectInputMultiple, ProfileFileInput, ConfirmCancelModal} from "@/shared";
import UserTaskModal from "./UserTaskModal";
import { userSchema } from "../../schemas/userSchema";
import { createUser } from "../../services/userService";
import { Plus } from "lucide-react";
import Alert from '@mui/material/Alert';

export default function UserRegisterForm(){

    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const [formData, setFormData] = useState({
        userName: "",
        userLastName: "",
        userEmail: "",
        userConfirmEmail: "",
        userInstitutionalEmail: "",
        userProfile: [],
        userDocumentType: "",
        userGroups: [],
        userDocumentNumber: "",
        userStartDate: "",
        userEndDate: "",
        userAdditionalPhone: "",
        userPhone: "",
        userAddress: "",
        userTasks: [],
    });
    
    const [errors, setErrors] = useState({});
    const [showAdditionalPhone, setShowAdditionalPhone] = useState(false);
    const [notification, setNotification] = useState(null);

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
        setFormData((prev) => ({ ...prev, userProfile: files }));
    };

    const handleAddTask = (task) => {
        setFormData((prev) => ({ ...prev, userTasks: [...prev.userTasks, task] }));
    };

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

            await createUser(result.data);

            setNotification({ message: "Usuario creado exitosamente", severity: "success" });
            navigate("/usuarios");

        } catch (error) {
            console.error("Error al crear usuario:", error);
            setNotification({ message: "Error al crear usuario: " + error.message, severity: "error" });
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 my-2 mx-2 sm:mx-4 justify-items-center p-2 sm:p-4">

                <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-left mb-4 w-full">
                    <div className="grid gap-2 justify-items-left">
                        <h1 className="text-h3">
                            Registro de Usuarios
                        </h1>
                        <h1 className="text-small text-text-muted">
                            Aca podras registrar a un usuario con los datos correspondientes
                        </h1>
                    </div>
                </div>

                {notification && (
                    <Alert severity={notification.severity} onClose={() => setNotification(null)}>
                        {notification.message}
                    </Alert>
                )}

                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center gap-6 mt-4 w-full"
                >
                    {/* Grid de inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 w-full">

                        {/* Columna izquierda */}
                        <div className="grid grid-cols-1 gap-4 min-w-0">
                            <Input
                                label="Nombres Completos"
                                name="userName"
                                autoComplete="given-name"
                                placeholder="Ingrese su nombre"
                                value={formData.userName}
                                onChange={handleChange}
                                error={errors.userName}
                                required
                            />
                            <SelectInput
                                label="Tipo de documento"
                                name="userDocumentType"
                                options={documentTypes}
                                value={formData.userDocumentType}
                                onChange={handleChange}
                                error={errors.userDocumentType}
                                required
                            />
                            <SelectInputMultiple
                                label="Tipo de Usuario"
                                name="userGroups"
                                options={userGroups}
                                value={formData.userGroups}
                                onChange={handleChange}
                                error={errors.userGroups}
                                required
                            />

                            <Input
                                label="Fecha de inicio"
                                name="userStartDate"
                                placeholder="Fecha de inicio"
                                type="date"
                                value={formData.userStartDate}
                                onChange={handleChange}
                                error={errors.userStartDate}
                                required
                            />

                            <Input
                                label="Fecha de Finalización"
                                name="userEndDate"
                                placeholder="Ingrese fecha de finalización"
                                type="date"
                                value={formData.userEndDate}
                                onChange={handleChange}
                                error={errors.userEndDate}
                                required
                            />
                        </div>

                        {/* Columna derecha */}
                        <div className="grid grid-cols-1 gap-4 min-w-0">
                            <Input
                                label="Apellidos Completos"
                                name="userLastName"
                                autoComplete="family-name"
                                placeholder="Ingrese sus apellidos"
                                value={formData.userLastName}
                                onChange={handleChange}
                                error={errors.userLastName}
                                required
                            />
                            <Input
                                label="Numero de documento"
                                name="userDocumentNumber"
                                placeholder="Ingrese su numero de documento"
                                value={formData.userDocumentNumber}
                                onChange={handleChange}
                                error={errors.userDocumentNumber}
                                required
                            />
                            <Input
                                label="Correo"
                                name="userEmail"
                                autoComplete="off"
                                placeholder="Ingrese su correo"
                                type="email"
                                value={formData.userEmail}
                                onChange={handleChange}
                                error={errors.userEmail}
                                required
                            />

                            <Input
                                label="Confirmar Correo"
                                name="userConfirmEmail"
                                autoComplete="off"
                                placeholder="Confirmar correo electronico"
                                type="email"
                                value={formData.userConfirmEmail}
                                onChange={handleChange}
                                error={errors.userConfirmEmail}
                                required
                            />

                            <Input
                                label="Correo Institucional (Opcional)"
                                name="userInstitutionalEmail"
                                autoComplete="off"
                                placeholder="Ingrese su correo institucional"
                                type="email"
                                value={formData.userInstitutionalEmail}
                                onChange={handleChange}
                                error={errors.userInstitutionalEmail}
                            />
                        </div>


                         <div className="grid grid-cols-1 gap-4 min-w-0">

                            <Input
                                label="Telefono"
                                name="userPhone"
                                autoComplete="tel"
                                placeholder="Ingrese su numero de telefono"
                                value={formData.userPhone}
                                onChange={handleChange}
                                error={errors.userPhone}
                                required
                            />
                            <div className="flex flex-col gap-2 ">
                                <label className="block text-medium text-text-primary">
                                    Telefono Adicional (Opcional)
                                </label>
                                {!showAdditionalPhone ? (
                                    
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={() => setShowAdditionalPhone(true)}
                                    >
                                        + Agregar número
                                    </Button>
                                ) : (
                                    <Input
                                        name="userAdditionalPhone"
                                        autoComplete="tel"
                                        placeholder="Ingrese su numero de telefono adicional"
                                        value={formData.userAdditionalPhone}
                                        onChange={handleChange}
                                        error={errors.userAdditionalPhone}
                                    />
                                )}
                            </div>

                            <Input
                                label="Direccion"
                                name="userAddress"
                                autoComplete="off"
                                placeholder="Ingrese su direccion"
                                value={formData.userAddress}
                                onChange={handleChange}
                                error={errors.userAddress}
                                required
                            />
                            {/* Botón que abre el modal de tareas */}
                            <div className="flex flex-col gap-2 ">
                                <label className="block text-medium text-text-primary">
                                    Tareas (Opcional)
                                </label>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={() => setShowTaskModal(true)}
                                >
                                    <Plus size={16} />
                                    Agregar tarea
                                </Button>

                                {/* Lista de tareas añadidas */}
                                {formData.userTasks.map((task, i) => (
                                    <span key={i} className="text-small text-text-primary bg-surface-muted border border-border rounded-[var(--radius-full)] px-3 py-1 w-fit">
                                        {task.taskName}
                                    </span>
                                ))}
                            </div>
                            <div className="h-20.75"></div>
                        </div>

                        <div className="min-w-0">
                            <ProfileFileInput
                                label="Foto de Perfil"
                                name="userProfile"
                                className="w-full h-58"
                                placeholder="Subir foto de perfil"
                                value={formData.userProfile}
                                onChange={handleProfileChange}
                                error={errors.userProfile}
                            />
                        </div>

                    </div>

                    <div className="flex gap-4">
                        <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>Cancelar</Button>
                        <Button type="submit"  variant="primary"   size="md">Crear</Button>
                    </div>

                </form>

            </div>

            <ConfirmCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => navigate(-1)}
            />

            <UserTaskModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onAdd={handleAddTask}
            />
        </>
    );
}
