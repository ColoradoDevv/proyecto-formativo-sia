import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocumentTypes, getUserRoles} from "../services/selectServices";
import {Input, Button, SelectInput, FileInput,ConfirmCancelModal, TagInput, Checkbox} from "@/shared";
import { userSchema } from "../schemas/userSchema";
import { Upload } from "lucide-react";

export default function UserRegisterForm(){

    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [formData, setFormData] = useState({
        userName: "",
        userLastName: "",
        userEmail: "",
        userConfirmEmail: "",
        userInstitutionalEmail: "",
        userProfile: [],
        userDocumentType: "",
        userRole: "",
        userDocumentNumber: "",
        userStartDate: "",
        userEndDate: "",
        userAdditionalPhone: "",
        userPhone: "",
        isActive: false,
        userAddres: "",
    });
    
    const uploadIcon = <Upload size={16} />;
    const [errors, setErrors] = useState({});
    
    const [documentTypes, setDocumentTypes] = useState([]);
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
    }, []);

    const [userRoles, setUserRoles] = useState([]);
    useEffect(() => {
        getUserRoles().then(setUserRoles);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
        console.log("Usuario validado", result.data);
    };

    return (
        <>
            <div className="grid grid-cols-1 my-2 mx-2 sm:mx-4 justify-items-center p-2 sm:p-4">

                <div className="grid grid-cols-1 sm:grid-cols-3 justify-items-left mb-4 w-full">
                    <div className="grid gap-2 justify-items-left">
                        <h1 className="text-xl font-bold">
                            Registro de Usuarios
                        </h1>
                        <h1 className="text-sm">
                            Aca podras registrar a un usuario con los datos correspondientes
                        </h1>
                    </div>
                </div>

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
                            <SelectInput
                                label="Tipo de Usuario"
                                name="userRole"
                                options={userRoles}
                                value={formData.userRole}
                                onChange={handleChange}
                                error={errors.userRole}
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
                            <Input
                                label="Telefono Adicional (Opcional)"
                                name="userAdditionalPhone"
                                autoComplete="tel"
                                placeholder="Ingrese su numero de telefono adicional"
                                value={formData.userAdditionalPhone}
                                onChange={handleChange}
                                error={errors.userAdditionalPhone}
                            />
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
                            <TagInput
                                label="Tareas (Opcional)"
                                name="userTasks"
                                placeholder="Agregar tareas"
                                value={formData.userTasks}
                                onChange={handleChange}
                                error={errors.userTasks}
                            />
                            <Checkbox
                                id="isActive"
                                label="Usuario Activo"
                                name="isActive"
                                className="h-18"
                                checked={formData.isActive}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="min-w-0">
                            <FileInput
                                label="Foto de Perfil"
                                name="userProfile"
                                className="w-full h-58"
                                placeholder="Subir foto de perfil"
                                type="file"
                                value={formData.userProfile}
                                onChange={handleChange}
                                error={errors.userProfile}
                                accept="image/*"
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
        </>
    );
}
