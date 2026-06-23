import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, SelectInputMultiple, ProfileFileInput, StatusBadge, cancelAlert } from "@/shared";
import EditCard from "./EditCard.jsx";
import { Undo2 } from "lucide-react";
import useUser from "../../hooks/useUser.js";
import { getDocumentTypes, getUserGroups } from "../../services/selectServices";
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

    return <UserEditForm user={user} documentTypes={documentTypes} groups={groups} />;
}

// Componente interno: recibe user ya cargado e inicializa el estado directamente
function UserEditForm({ user, documentTypes, groups }) {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (files) => {
        setFormData(prev => ({ ...prev, profilePicture: files }));
    };

    function handleSubmit(e) {
        e.preventDefault();
        navigate(-1);
    }

    async function handleCancel() {
        const result = await cancelAlert();
        if (result.isConfirmed) navigate(-1);
    }

    const isActive = formData.isActive === "true";

    return (
        <div className="h-full p-4 text-text-primary flex flex-col gap-4">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 />
                </IconButton>
                <div>
                    <h2 className="text-h3">Editar Usuario</h2>
                    <p className="text-small text-text-muted">Modifica la información del usuario.</p>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Información Personal — 3 columnas con foto integrada */}
                <EditCard title="Información Personal" cols={3}>

                    {/* Col 1 */}
                    <div className="flex flex-col gap-3">
                        <Input
                            label="Nombres"
                            name="firstName"
                            placeholder="Ingresa el nombre"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Apellidos"
                            name="lastName"
                            placeholder="Ingresa los apellidos"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-3">
                        <SelectInput
                            label="Tipo de documento"
                            name="documentType"
                            options={documentTypes}
                            value={formData.documentType}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Número de documento"
                            name="documentNumber"
                            placeholder="Ingresa el número"
                            value={formData.documentNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Col 3 — foto ocupa fila 1 y 2 */}
                    <div className="row-span-2 flex flex-col items-center justify-center gap-3">
                        <ProfileFileInput
                            className="w-32 h-32 rounded-[var(--radius-xl)]"
                            value={formData.profilePicture}
                            onChange={handlePhotoChange}
                        />
                        <StatusBadge active={isActive} />
                    </div>

                    {/* Dirección — ocupa cols 1 y 2 en fila 2 */}
                    <div className="col-span-2">
                        <Input
                            label="Dirección"
                            name="address"
                            placeholder="Ingresa la dirección"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </EditCard>

                {/* Contacto y Sistema lado a lado */}
                <div className="grid grid-cols-2 gap-6">

                    <EditCard title="Información de Contacto">
                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Correo institucional"
                            name="institutionalEmail"
                            type="email"
                            placeholder="correo@sena.edu.co"
                            value={formData.institutionalEmail}
                            onChange={handleChange}
                        />
                        <Input
                            label="Teléfono"
                            name="phone"
                            placeholder="Número de teléfono"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Teléfono adicional"
                            name="additionalPhone"
                            placeholder="Número adicional (opcional)"
                            value={formData.additionalPhone}
                            onChange={handleChange}
                        />
                    </EditCard>

                    <EditCard title="Información del Sistema">
                        <SelectInputMultiple
                            label="Tipo de usuario"
                            name="groups"
                            options={groups}
                            value={formData.groups}
                            onChange={handleChange}
                            required
                        />
                        <SelectInput
                            label="Estado"
                            name="isActive"
                            options={STATUS_OPTIONS}
                            value={formData.isActive}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Fecha de inicio"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Fecha de finalización"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </EditCard>

                </div>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                        Guardar cambios
                    </Button>
                </div>

            </form>

        </div>
    );
}
