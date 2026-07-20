import { Input, Select, TextArea } from "@/shared";

// Campos de préstamo, reutilizables entre crear y editar.
// PRESENTACIONAL: recibe formData/errors/onChange y las opciones de selects.
// `extraSlot` permite inyectar campos propios de un modo (ej. la fecha de
// préstamo de solo lectura en edición).
export default function LoanForm({
    formData,
    errors = {},
    onChange,
    users = [],
    materials = [],
    extraSlot = null,
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
            <Select
                label="Usuario"
                name="loanUser"
                options={users}
                value={formData.loanUser}
                onChange={onChange}
                error={errors.loanUser}
                required
            />
            <Select
                label="Material"
                name="loanMaterial"
                options={materials}
                value={formData.loanMaterial}
                onChange={onChange}
                error={errors.loanMaterial}
                required
            />
            <Input
                label="Cantidad Préstamo"
                name="loanAmount"
                placeholder="Ingrese la cantidad del préstamo"
                type="number"
                min="1"
                step="1"
                value={formData.loanAmount}
                onChange={onChange}
                error={errors.loanAmount}
                required
            />
            <Input
                label="Grupo"
                name="loanGroup"
                placeholder="Ingrese su grupo"
                value={formData.loanGroup}
                onChange={onChange}
                error={errors.loanGroup}
                required
            />
            <Input
                label="Fecha Devolución"
                name="loanReturnDate"
                type="date"
                value={formData.loanReturnDate}
                onChange={onChange}
                error={errors.loanReturnDate}
                required
            />
            {extraSlot}
            <div className="sm:col-span-2">
                <TextArea
                    label="Justificación de Uso"
                    name="loanJustification"
                    placeholder="Ingrese la justificación de uso"
                    value={formData.loanJustification}
                    onChange={onChange}
                    error={errors.loanJustification}
                    required
                />
            </div>
        </div>
    );
}
