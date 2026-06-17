import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared";
import { users } from "../../data/users/users";
import DetailCard from "./DetailCard";
import DetailField from "./DetailField";

export default function UserDetailView() {
    const navigate = useNavigate();
    const { id }   = useParams();
    const user     = users.find((u) => String(u.id) === String(id)) ?? users[0];

    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            {/* Encabezado */}
            <div className="flex flex-col gap-1">
                <h2 className="text-h3 font-heading">Visualizar Usuario</h2>
                <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">

                {/* foto + nombre + estado + botón */}
                <div className="flex flex-col sm:flex-row items-center justify-sm:items-start gap-5 p-5 rounded-[var(--radius-2xl)] border border-border bg-surface-hover">

                    <div className="w-20 h-20 rounded-[var(--radius-full)] overflow-hidden border border-border bg-surface-muted flex items-center justify-center shrink-0">
                        {user.profilePicture
                            ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            : <span className="text-h2 font-heading text-text-muted">{(user.name ?? "?")[0].toUpperCase()}</span>
                        }
                    </div>

                    <div className="flex flex-col gap-1 flex-1 text-center sm:text-left">
                        <h3 className="text-h3 font-heading">{user.name}</h3>
                        <span className="text-small text-text-muted">{user.groups && user.groups.length > 0 ? user.groups.map(g => g.name).join(", ") : "Sin grupo"}</span>
                        <span className={`mt-1 w-fit px-3 py-0.5 rounded-[var(--radius-full)] text-caption font-medium ${user.is_active !== false ? "bg-success-soft text-success" : "bg-error-soft text-error"}`}>
                            {user.is_active !== false ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    <Button variant="primary" size="md" onClick={() => navigate(`/usuarios/editar/${user.id}`)}>
                        Editar
                    </Button>
                </div>
                
                {/* Card de información personal */}
                <DetailCard title="Información Personal">
                    <DetailField    
                        label="Nombre completo"     
                        value={user.name} 
                    />
                    <DetailField    
                        label="Tipo de documento"   
                        value={user.documentType}   
                    />
                    <DetailField    
                        label="Número de documento"     
                        value={user.documentNumber}     
                    />
                </DetailCard>

                {/* Card de información de contacto */}
                <DetailCard title="Información de Contacto">
                    <DetailField    
                        label="Correo electrónico"  
                        value={user.email}  
                    />
                    <DetailField    
                        label="Correo institucional"    
                        value={user.institutionalEmail}     
                    />
                    <DetailField    
                        label="Teléfono"    
                        value={user.phone}  
                    />
                    <DetailField    
                        label="Teléfono adicional"  
                        value={user.additionalPhone}    
                    />
                    <DetailField    
                        label="Dirección"   
                        value={user.addres ?? user.address}     
                        fullWidth   
                    />
                </DetailCard>

                {/* Card de información del sistema */}
                <DetailCard title="Información del Sistema">
                    <DetailField
                        label="Tipo de usuario"
                        value={user.groups && user.groups.length > 0 ? user.groups.map(g => g.name).join(", ") : "Sin grupo"}
                    />
                    <DetailField    
                        label="Estado"                  
                        value={user.is_active !== false ? "Activo" : "Inactivo"}    
                    />
                    <DetailField    
                        label="Fecha de inicio"         
                        value={user.startDate}  
                    />
                    <DetailField    
                        label="Fecha de finalización"   
                        value={user.endDate}    
                    />
                </DetailCard>
            </div>
            

        </div>
    );
}
