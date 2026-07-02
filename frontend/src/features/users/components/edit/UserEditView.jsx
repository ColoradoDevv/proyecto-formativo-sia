import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, StatusLabel, showAlert, cancelAlert } from "@/shared";
import { Undo2, ClipboardList } from "lucide-react";
import useUser from "../../hooks/useUser.js";
import useUserGroups from "../../hooks/useUserGroups";
import { getDocumentTypes } from "../../services/selectServices";
import { userEditSchema } from "../../schemas/userSchema";
import { updateUser } from "../../services/userService";
import { UserTasksModal } from "@/features/tasks";
import UserForm from "../UserForm";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

// Componente externo: maneja el fetch, loading y error
export default function UserEditView() {
    const { id } = useParams();
    const { user, loading, error } = useUser(id);

    const [documentTypes, setDocumentTypes] = useState([]);
    const { groups, addGroup } = useUserGroups();

    useEffect(() => { getDocumentTypes().then(setDocumentTypes); }, []);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
            </div>
        );

    if (error) return <p>Error al cargar usuario: {error.message}</p>;

    return <UserEditForm id={id} user={user} documentTypes={documentTypes} groups={groups} onCreateGroup={addGroup} />;
}

// Componente interno: recibe user ya cargado e inicializa el estado directamente
function UserEditForm({ id, user, documentTypes, groups, onCreateGroup }) {
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
    const [showTaskModal, setShowTaskModal] = useState(false);

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

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
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
                    onCreateGroup={onCreateGroup}
                    showStatus
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
                        // Tareas del usuario: abre el modal con las tareas reales (BD)
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
                    }
                />

                <div className="flex gap-4 justify-center md:justify-end">
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
