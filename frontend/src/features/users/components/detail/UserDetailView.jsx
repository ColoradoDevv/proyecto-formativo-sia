import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, DetailCard, DetailField } from "@/shared";
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


    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <IconButton onClick={() => navigate(-1)} variant="ghost">
                    <Undo2/>
                </IconButton>
                <div>
                    <h2 className="text-h3">Visualizar Usuario</h2>
                    <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
                </div>
            </div>

            <div className="grid grid-cols gap-6">

                {/* Card de información personal */}
                <DetailCard title="Información Personal">
                    {/* Col 1: nombre + tipo de documento */}
                    <div className="flex flex-col gap-4">
                        <DetailField
                            label="Nombre completo"
                            value={user.first_name + " " + user.last_name}
                        />
                        <DetailField
                            label="Tipo de documento"
                            value={user.document_type?.name ?? "Sin tipo de documento"}
                        />
                    </div>
                    {/* Col 2: número de documento */}
                    <DetailField
                        label="Número de documento"
                        value={user.document_number}
                    />
                    {/* Col 3: foto de perfil */}
                    <div className="flex items-center justify-center">
                        <div className="w-20 h-20 rounded-[var(--radius-full)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center shrink-0">
                            {user.profilePicture
                                ? <img src={user.profilePicture} alt={user.first_name} className="w-full h-full object-cover" />
                                : <span className="text-h2 font-heading text-text-muted">{(user.first_name ?? "?")[0].toUpperCase()}</span>
                            }
                        </div>
                    </div>
                </DetailCard>

                {/* Card de información de contacto */}
                <DetailCard title="Información de Contacto">
                    <DetailField
                        label="Correo electrónico"
                        value={user.email}
                        />
                    <DetailField
                        label="Correo institucional"
                        value={user.institutional_email}
                    />
                    <DetailField
                        label="Teléfono"
                        value={user.phone_number}
                        />
                    <DetailField
                        label="Teléfono adicional"
                        value={user.second_phone_number ?? "Sin teléfono adicional"}
                        />
                    <DetailField
                        label="Dirección"
                        value={user.address}
                        fullWidth
                        />
                </DetailCard>

                {/* Card de información del sistema */}
                <DetailCard title="Información del Sistema">
                    <DetailField
                        label="Tipo de usuario"
                        value={user.groups && user.groups.length > 0
                            ? user.groups.map(g => g.name).join(", ")
                            : "Sin grupo asignado"}
                        />
                    <DetailField
                        label="Estado"
                        value={user.is_active !== false ? "Activo" : "Inactivo"}
                        />
                    <div className="flex gap-8">
                        <DetailField
                            label="Fecha de inicio"
                            value={user.start_date}
                        />
                        <DetailField
                            label="Fecha de finalización"
                            value={user.end_date ?? "No definida"}
                        />
                    </div>
                </DetailCard>
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
    );
}
