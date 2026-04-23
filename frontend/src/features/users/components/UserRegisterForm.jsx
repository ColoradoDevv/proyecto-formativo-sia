import { useState, useEffect } from "react";
import { getDocumentTypes } from "../services/selectServices";
import {Input, Button, SelectInput} from "@/shared";
import { userSchema } from "../schemas/userSchema";

export default function UserRegisterForm(){

    const [documentTypes, setDocumentTypes] = useState([]);
    const [formData, setFormData] = useState({
        userName: "",
        userLastName: "",
        userEmail: "",
        userConfirmEmail: "",
        userDocumentType: "",
        userDocumentNumber: "",
        userPassword: "",
        userConfirmPassword: "",
        userStartDate: "",
        userEndDate: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
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
        <div className="grid grid-cols-1 my-4 mx-4 justify-items-center gap-8 p-4">

            <div className="grid grid-cols-3 justify-items-left">
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
                className="flex flex-col items-center gap-6"
            >
                {/* Grid de inputs */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                    {/* Columna izquierda */}
                    <div className="grid grid-cols-1 gap-4">
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
                            label="Contraseña"
                            name="userPassword"
                            autoComplete="new-password"
                            placeholder="Ingrese su contraseña"
                            type="password"
                            value={formData.userPassword}
                            onChange={handleChange}
                            error={errors.userPassword}
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
                    </div>

                    {/* Columna derecha */}
                    <div className="grid grid-cols-1 gap-4">
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
                            label="Confirmar Contraseña"
                            name="userConfirmPassword"
                            autoComplete="new-password"
                            placeholder="Confirmar contraseña"
                            type="password"
                            value={formData.userConfirmPassword}
                            onChange={handleChange}
                            error={errors.userConfirmPassword}
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

                </div>

                {/* Botones */}
                <div className="flex gap-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                    >
                        Crear
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="md2"
                    >
                        Cancelar
                    </Button>
                </div>

            </form>

        </div>
    );
}