import { useEffect, useState } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { TailChase } from "ldrs/react";
import { Button, EditCard, Input, ProfileFileInput, showAlert } from "@/shared";
import { getMyProfile, updateUserProfilePicture } from "../../services/userService";

const readOnlyValue = (value) => value || "No registrado";

export default function ProfileEditPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePicture, setProfilePicture] = useState([]);
    const [savingPicture, setSavingPicture] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        getMyProfile(controller.signal)
            .then((data) => {
                setUser(data);
                setProfilePicture(data.profile_picture ? [data.profile_picture] : []);
            })
            .catch((requestError) => {
                if (requestError.name !== "AbortError") setError(requestError);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const handleSavePicture = async () => {
        const picture = profilePicture[0];
        if (!(picture instanceof File)) {
            await showAlert({
                icon: "info",
                title: "Selecciona una nueva imagen",
                text: "Elige una foto JPG o PNG antes de guardar los cambios.",
            });
            return;
        }

        setSavingPicture(true);
        try {
            const updatedUser = await updateUserProfilePicture(picture);
            setUser(updatedUser);
            setProfilePicture(updatedUser.profile_picture ? [updatedUser.profile_picture] : []);
            await showAlert({
                icon: "success",
                iconColor: "var(--color-success)",
                title: "Foto de perfil actualizada",
            });
        } catch (requestError) {
            await showAlert({
                icon: "error",
                iconColor: "var(--color-error)",
                title: "No se pudo actualizar la foto",
                text: requestError.message,
            });
        } finally {
            setSavingPicture(false);
        }
    };

    const handlePasswordMockup = async () => {
        await showAlert({
            icon: "info",
            title: "Próximamente",
            text: "El cambio de contraseña está disponible como maqueta mientras se implementa el flujo seguro.",
        });
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center"><TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" /></div>;
    }

    if (error || !user) {
        return <div className="p-4 text-error">No se pudo cargar tu perfil: {error?.message ?? "Usuario no encontrado."}</div>;
    }

    const groupNames = user.groups?.map((group) => group.name).filter(Boolean).join(", ");

    return (
        <div className="p-3 sm:p-4 text-text-primary flex flex-col gap-3 pb-8">
            <div className="flex items-center gap-3">
                <UserRound className="text-primary" size={24} />
                <div>
                    <h2 className="text-primary">Mi perfil</h2>
                    <p className="text-small text-text-muted">Consulta tus datos personales y actualiza tu foto de perfil.</p>
                </div>
            </div>

            <EditCard title="Foto de perfil" cols={1}>
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <ProfileFileInput
                        className="w-32 h-40 rounded-[var(--radius-xl)]"
                        value={profilePicture}
                        onChange={setProfilePicture}
                        label="Imagen"
                        optional
                        description="Formato JPG o PNG. Tamaño máximo: 2MB."
                    />
                    <Button onClick={handleSavePicture} disabled={savingPicture} className="sm:mb-1">
                        <Save size={16} />
                        {savingPicture ? "Guardando..." : "Guardar foto"}
                    </Button>
                </div>
            </EditCard>

            <EditCard title="Información personal">
                <Input label="Nombres" value={readOnlyValue(user.first_name)} readOnly />
                <Input label="Apellidos" value={readOnlyValue(user.last_name)} readOnly />
                <Input label="Tipo de documento" value={readOnlyValue(user.document_type?.name)} readOnly />
                <Input label="Número de documento" value={readOnlyValue(user.document_number)} readOnly />
                <div className="sm:col-span-2"><Input label="Dirección" value={readOnlyValue(user.address)} readOnly /></div>
            </EditCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <EditCard title="Información de contacto" cols={1}>
                    <Input label="Correo electrónico" value={readOnlyValue(user.email)} readOnly />
                    <Input label="Correo institucional" value={readOnlyValue(user.institutional_email)} readOnly />
                    <Input label="Teléfono" value={readOnlyValue(user.phone_number)} readOnly />
                    <Input label="Teléfono adicional" value={readOnlyValue(user.second_phone_number)} readOnly />
                </EditCard>

                <EditCard title="Información del sistema" cols={1}>
                    <Input label="Fecha de inicio" value={readOnlyValue(user.start_date)} readOnly />
                    <Input label="Fecha de finalización" value={readOnlyValue(user.end_date)} readOnly />
                    <Input label="Tipo de usuario" value={readOnlyValue(groupNames)} readOnly />
                </EditCard>
            </div>

            <EditCard title="Seguridad" cols={1}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-body">Contraseña</p>
                        <p className="text-small text-text-muted">Cambia la contraseña de tu cuenta.</p>
                    </div>
                    <Button variant="secondary" onClick={handlePasswordMockup}>
                        <KeyRound size={16} /> Cambiar contraseña
                    </Button>
                </div>
            </EditCard>
        </div>
    );
}
