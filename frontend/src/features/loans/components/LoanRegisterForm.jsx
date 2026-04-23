import { useState } from "react";
import { Input, Button } from "@/shared";
import { loanSchema } from "../schemas/loanSchema";

export default function LoanRegisterForm() {
    const [formData, setFormData] = useState({
        loanAmount: "",
        loanGroup: "",
        loanJustification: "",
        loanReturnDate: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = loanSchema.safeParse(formData);

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
        console.log("Prestamo validado", result.data);
    };

    return (
        <div className="grid grid-cols-1 my-4 mx-4 justify-items-center gap-8 p-4">
            <div className="grid grid-cols-3 justify-items-left">
                <div className="grid gap-2 justify-items-left">
                    <h1 className="text-xl font-bold">
                        Crear Prestamo
                    </h1>

                    <h1 className="text-sm">
                        Aca podras crear un prestamo con los datos correspondientes
                    </h1>
                </div>
            </div>

            <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-6"
            >
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Cantidad Prestamo"
                        name="loanAmount"
                        placeholder="Ingrese la cantidad del prestamo"
                        type="number"
                        min="1"
                        step="1"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        error={errors.loanAmount}
                        required
                    />
                    <Input
                        label="Grupo"
                        name="loanGroup"
                        placeholder="Ingrese su grupo"
                        value={formData.loanGroup}
                        onChange={handleChange}
                        error={errors.loanGroup}
                        required
                    />
                    <Input
                        label="Justificacion de Uso"
                        name="loanJustification"
                        placeholder="Ingrese la justificacion de uso"
                        value={formData.loanJustification}
                        onChange={handleChange}
                        error={errors.loanJustification}
                        required
                    />
                    <Input
                        label="Fecha Devolucion"
                        name="loanReturnDate"
                        type="date"
                        value={formData.loanReturnDate}
                        onChange={handleChange}
                        error={errors.loanReturnDate}
                        required
                    />
                </div>

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
