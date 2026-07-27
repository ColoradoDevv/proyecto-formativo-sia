import { Input, Select, SelectMultiple, TextArea, EditCard } from "@/shared";

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
    multipleMaterials = false,
    onMaterialQuantityChange,
    loanDepartureDate = "",
    extraSlot = null,
}) {
    return (

        <EditCard title="Información del Préstamo" cols={1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
                <Select
                    label="Usuario Responsable del Préstamo"
                    name="loanResponsableUser"
                    options={users}
                    value={formData.loanResponsableUser}
                    onChange={onChange}
                    error={errors.loanResponsableUser}
                    required
                />
                <Select
                    label="Usuario Receptor del Préstamo"
                    name="loanReceptorUser"
                    options={users}
                    value={formData.loanReceptorUser}
                    onChange={onChange}
                    error={errors.loanReceptorUser}
                    required
                />
                {multipleMaterials ? (
                    <>
                        <div className="sm:col-span-2">
                            <SelectMultiple
                                label="Materiales"
                                name="loanMaterial"
                                options={materials}
                                value={formData.loanMaterial}
                                onChange={onChange}
                                error={errors.loanMaterial}
                                required
                            />
                        </div>
                        {formData.loanMaterial.map((materialId) => {
                            const material = materials.find((item) => String(item.id) === String(materialId));
                            return (
                                <Input
                                    key={materialId}
                                    label={`Cantidad: ${material?.label ?? "Material seleccionado"}`}
                                    name={`loanMaterialQuantities.${materialId}`}
                                    placeholder="Cantidad a prestar"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={formData.loanMaterialQuantities?.[materialId] ?? ""}
                                    onChange={(event) => onMaterialQuantityChange?.(materialId, event.target.value)}
                                    error={errors.loanMaterialQuantities?.[materialId]}
                                    required
                                />
                            );
                        })}
                    </>
                ) : (
                    <Select
                        label="Material"
                        name="loanMaterial"
                        options={materials}
                        value={formData.loanMaterial}
                        onChange={onChange}
                        error={errors.loanMaterial}
                        required
                    />
                )}
                {!multipleMaterials && (
                    <Input
                        label="Cantidad del Préstamo"
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
                )}
                <Input
                    label="Numero de Grupo o Ficha"
                    name="loanGroup"
                    placeholder="Ingrese su número de grupo o ficha"
                    value={formData.loanGroup}
                    onChange={onChange}
                    error={errors.loanGroup}
                    required
                />
                <Input
                    label="Fecha de salida"
                    type="date"
                    value={loanDepartureDate}
                    disabled
                    readOnly
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
        </EditCard>
);
}
