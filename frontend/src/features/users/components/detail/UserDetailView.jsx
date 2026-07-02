import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Input, StatusBadge, EditCard } from "@/shared";
import useUser from "../../hooks/useUser.js";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { Undo2 } from "lucide-react";

export default function UserDetailView() {
    const navigate = useNavigate();
    const { id }   = useParams();

    // FETCH GET /api/users/{id}/
    const { user, loading, error } = useUser(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)"/>
            </div>
        )

    if (error) return <p>Error al cargar Usuarios: {error.message}</p>

    // Valores de solo lectura (los selects de Editar se muestran como texto).
    const documentTypeLabel = user.document_type?.name ?? "Sin tipo de documento";
    const groupsLabel = user.groups && user.groups.length > 0
        ? user.groups.map((g) => g.name).join(", ")
        : "Sin grupo asignado";
    const isActive = user.is_active !== false;

    return (
        <div className="h-full p-3 sm:p-4 text-text-primary flex flex-col gap-3">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2 size={18}/>
                </IconButton>
                <div>
                    <h2 className="text-primary">Visualizar Usuario</h2>
                </div>
            </div>

            <div className="flex flex-col gap-3">

                {/* Información Personal — foto lateral + campos */}
                <EditCard title="Información Personal" cols={1}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                        {/* Foto + estado */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-24 h-24 rounded-[var(--radius-xl)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center">
                                {user.profilePicture
                                    ? <img src={user.profilePicture} alt={user.first_name} className="w-full h-full object-cover" />
                                    : <span className="text-h1 font-heading text-text-muted">{(user.first_name ?? "?")[0].toUpperCase()}</span>
                                }
                            </div>
                            <StatusBadge active={isActive} />
                        </div>

                        {/* Campos personales */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 min-w-0">
                            <Input label="Nombres" value={user.first_name ?? ""} disabled readOnly />
                            <Input label="Apellidos" value={user.last_name ?? ""} disabled readOnly />
                            <Input label="Tipo de documento" value={documentTypeLabel} disabled readOnly />
                            <Input label="Número de documento" value={user.document_number ?? ""} disabled readOnly />
                            <div className="sm:col-span-2">
                                <Input label="Dirección" value={user.address ?? ""} disabled readOnly />
                            </div>
                        </div>

                    </div>
                </EditCard>

                {/* Contacto y Sistema lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <EditCard title="Información de Contacto">
                        <Input label="Correo electrónico" value={user.email ?? ""} disabled readOnly />
                        <Input label="Correo institucional" value={user.institutional_email ?? ""} disabled readOnly />
                        <Input label="Teléfono" value={user.phone_number ?? ""} disabled readOnly />
                        <Input label="Teléfono adicional" value={user.second_phone_number ?? ""} disabled readOnly />
                    </EditCard>

                    <EditCard title="Información del Sistema">
                        <Input label="Tipo de usuario" value={groupsLabel} disabled readOnly />
                        <Input label="Estado" value={isActive ? "Activo" : "Inactivo"} disabled readOnly />
                        <Input label="Fecha de inicio" value={user.start_date ?? ""} disabled readOnly />
                        <Input label="Fecha de finalización" value={user.end_date ?? "No definida"} disabled readOnly />
                    </EditCard>

                </div>

                <div className="flex gap-4 justify-center md:justify-end">
                    <Button variant="secondary" size="md" onClick={() => navigate(`/usuarios`)}>
                        Volver al inicio
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate(`/usuarios/editar/${user.id}`)}>
                        Editar
                    </Button>
                </div>

            </div>

        </div>
    );
}
