import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Input, SelectInput, ConfirmCancelModal } from "@/shared";
import EditCard from "./EditCard.jsx";
import { Undo2, Pencil } from "lucide-react";

const MOCK_USER = {
    id: 1,
    first_name: "Juan",
    last_name: "Pérez",
    email: "juanperez@gmail.com",
    institutional_email: "juanperez@sena.edu.co",
    phone_number: "3100000137",
    second_phone_number: "",
    address: "Calle 10 #13-25 Bogotá",
    document_number: "1000000317",
    document_type_id: "1",
    role_id: "1",
    is_active: true,
    start_date: "2024-02-02",
    end_date: "",
    profilePicture: null,
};

const DOCUMENT_TYPES = [
    { id: "1", label: "Cédula de Ciudadanía" },
    { id: "2", label: "Tarjeta de Identidad" },
    { id: "3", label: "Cédula de Extranjería" },
    { id: "4", label: "Permiso Especial de Permanencia" },
];

const USER_ROLES = [
    { id: "1", label: "Instructor" },
    { id: "2", label: "Administrador" },
    { id: "3", label: "Invitado" },
];

const STATUS_OPTIONS = [
    { id: "true",  label: "Activo" },
    { id: "false", label: "Inactivo" },
];

export default function UserEditView() {
    const navigate = useNavigate();
    const photoInputRef = useRef();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(MOCK_USER.profilePicture);

    const [formData, setFormData] = useState({
        firstName:         MOCK_USER.first_name,
        lastName:          MOCK_USER.last_name,
        email:             MOCK_USER.email,
        institutionalEmail: MOCK_USER.institutional_email,
        phone:             MOCK_USER.phone_number,
        additionalPhone:   MOCK_USER.second_phone_number,
        address:           MOCK_USER.address,
        documentType:      MOCK_USER.document_type_id,
        documentNumber:    MOCK_USER.document_number,
        role:              MOCK_USER.role_id,
        isActive:          String(MOCK_USER.is_active),
        startDate:         MOCK_USER.start_date,
        endDate:           MOCK_USER.end_date,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setPhotoPreview(URL.createObjectURL(file));
    };

    function handleSubmit(e) {
        e.preventDefault();
        navigate(-1);
    }

    const isActive   = formData.isActive === "true";
    const activeRole = USER_ROLES.find(r => r.id === formData.role);

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 />
                </IconButton>
                <div>
                    <h2 className="text-h3">Editar Usuario</h2>
                    <p className="text-sm text-text-muted">Modifica la información del usuario.</p>
                </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Tarjeta de perfil */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl border border-border bg-surface-hover">
                    <div className="relative shrink-0">
                        <div className="size-20 rounded-full overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                            {photoPreview
                                ? <img src={photoPreview} alt={formData.firstName} className="w-full h-full object-cover" />
                                : <span className="text-xl font-semibold text-text-muted">{(formData.firstName || "?")[0].toUpperCase()}</span>
                            }
                        </div>
                        <button
                            type="button"
                            aria-label="Cambiar foto de perfil"
                            onClick={() => photoInputRef.current.click()}
                            className="absolute bottom-0 right-0 size-7 bg-brand text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
                        >
                            <Pencil size={13} />
                        </button>
                        <input
                            ref={photoInputRef}
                            type="file"
                            hidden
                            aria-label="Subir foto de perfil"
                            accept=".jpg,.jpeg,.png"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold">
                            {formData.firstName || "—"} {formData.lastName}
                        </h3>
                        <span className="text-sm text-text-muted">{activeRole?.label ?? "Sin rol"}</span>
                        <span className={`mt-1 w-fit mx-auto sm:mx-0 px-3 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {isActive ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                </div>

                {/* Información Personal */}
                <EditCard title="Información Personal">
                    <Input
                        label="Nombres"
                        name="firstName"
                        placeholder="Ingresa el nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                    <Input
                        label="Apellidos"
                        name="lastName"
                        placeholder="Ingresa los apellidos"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                    <SelectInput
                        label="Tipo de documento"
                        name="documentType"
                        options={DOCUMENT_TYPES}
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
                        className="w-full"
                        required
                    />
                </EditCard>

                {/* Información de Contacto */}
                <EditCard title="Información de Contacto">
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                    <Input
                        label="Correo institucional"
                        name="institutionalEmail"
                        type="email"
                        placeholder="correo@sena.edu.co"
                        value={formData.institutionalEmail}
                        onChange={handleChange}
                        className="w-full"
                    />
                    <Input
                        label="Teléfono"
                        name="phone"
                        placeholder="Número de teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                    <Input
                        label="Teléfono adicional"
                        name="additionalPhone"
                        placeholder="Número adicional (opcional)"
                        value={formData.additionalPhone}
                        onChange={handleChange}
                        className="w-full"
                    />
                    <div className="sm:col-span-2">
                        <Input
                            label="Dirección"
                            name="address"
                            placeholder="Ingresa la dirección"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full"
                            required
                        />
                    </div>
                </EditCard>

                {/* Información del Sistema */}
                <EditCard title="Información del Sistema">
                    <SelectInput
                        label="Tipo de usuario"
                        name="role"
                        options={USER_ROLES}
                        value={formData.role}
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
                        className="w-full"
                        required
                    />
                    <Input
                        label="Fecha de finalización"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full"
                    />
                </EditCard>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="secondary" size="md" onClick={() => setShowCancelModal(true)}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                        Guardar cambios
                    </Button>
                </div>

            </form>

            <ConfirmCancelModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => navigate(-1)}
            />

        </div>
    );
}
