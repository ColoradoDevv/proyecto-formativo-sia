import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared";

import EditCard from "./EditCard.jsx";
import EditField from "./EditField";
import useUser from "../../hooks/useUser.js";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

export default function UserEditView() {
    const navigate = useNavigate();
    const { id }   = useParams();

    // FETCH GET /api/users/{id}/
    const { user, loading, error } = useUser(id);

    if (loading)
        return (
            <div className="h-full flex items-center justify-center">
                <TailChase size="40" speed="1.75" color="black"/>
            </div>
        )

    if (error) return <p>Error al cargar Usuarios: {error.message}</p>


    return (
        <div className="h-full p-6 text-text-primary flex flex-col gap-6">
            {/* Encabezado */}
            <div className="flex flex-col gap-1">
                <h2 className="text-h3">Editar Usuario</h2>
                <p className="text-sm text-text-muted">Información editable del usuario.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">

                {/* foto + nombre + estado + botón */}
                <div className="flex flex-col sm:flex-row items-center justify-sm:items-start gap-5 p-5 rounded-2xl border border-border bg-surface-hover">

                    <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-surface-muted flex items-center justify-center shrink-0">
                        {user.profilePicture
                            ? <img src={user.profilePicture} alt={user.first_name} className="w-full h-full object-cover" />
                            : <span className="text-xl font-semibold text-text-muted">{(user.first_name ?? "?")[0].toUpperCase()}</span>
                        }
                    </div>

                    <div className="flex flex-col gap-1 flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold">{user.first_name} {user.last_name}</h3>
                        <span className="text-sm text-text-muted">{user.role?.name ?? "Sin rol"}</span>
                        <span className={`mt-1 w-fit px-3 py-0.5 rounded-full text-xs font-medium ${user.is_active !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {user.is_active !== false ? "Activo" : "Inactivo"}
                        </span>
                    </div>

                    <Button variant="primary" size="md" onClick={() => navigate(`/usuarios/editar/${user.id}`)}>
                        Editar
                    </Button>
                </div>
                
                {/* Card de información personal */}
                <EditCard title="Información Personal">
                    <EditField    
                        label="Nombre completo"     
                        value={user.first_name + " " + user.last_name} 
                    />
                    <EditField    
                        label="Tipo de documento"   
                        value={user.document_type?.name ?? "Sin tipo de documento"}   
                    />
                    <EditField    
                        label="Número de documento"     
                        value={user.document_number}     
                    />
                </EditCard>

                {/* Card de información de contacto */}
                <EditCard title="Información de Contacto">
                    <EditField    
                        label="Correo electrónico"  
                        value={user.email}  
                    />
                    <EditField    
                        label="Correo institucional"    
                        value={user.institutional_email}     
                    />
                    <EditField    
                        label="Teléfono"    
                        value={user.phone_number}  
                    />
                    <EditField    
                        label="Teléfono adicional"  
                        value={user.second_phone_number ?? "Sin teléfono adicional"}    
                    />
                    <EditField    
                        label="Dirección"   
                        value={user.address}     
                        fullWidth   
                    />
                </EditCard>

                {/* Card de información del sistema */}
                <EditCard title="Información del Sistema">
                    <EditField    
                        label="Tipo de usuario"         
                        value={user.role?.name ?? "Sin rol"}   
                    />
                    <EditField    
                        label="Estado"                  
                        value={user.is_active !== false ? "Activo" : "Inactivo"}    
                    />
                    <EditField    
                        label="Fecha de inicio"         
                        value={user.start_date}  
                    />
                    <EditField    
                        label="Fecha de finalización"   
                        value={user.end_date ?? "No definida"}    
                    />
                </EditCard>
            </div>
            

        </div>
    );
}
