import { Checkbox, Select, Switch, Button, Input } from "@/shared";


export default function PermissionModule({   
  groupPermissions }) {


  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-h3 font-heading mb-4">Gestión usuarios</h2>


      <div className="flex flex-wrap gap-6">
        <Checkbox
          id="create_user"
          name="create_user"
          label="Crear usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "create_user",
          )}
          onChange={() => {}}
        />


        <Checkbox
          id="list_user"
          name="list_user"
          label="Listar usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "list_user",
          )}
          onChange={() => {}}
        />
        <Checkbox
          id="update_user"
          name="update_user"
          label="Actualizar usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "update_user",
          )}
          onChange={() => {}}
        />
        <Checkbox
          id="deactivate_user"
          name="deactivate_user"
          label="Deshabilitar usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "deactivate_user",
          )}
          onChange={() => {}}
        />
        <Checkbox
          id="view_user"
          name="view_user"
          label="Ver usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "view_user",
          )}
          onChange={() => {}}
        />
        <Checkbox
          id="generate_report_user"
          name="generate_report_user"
          label="Generar reporte de usuarios"
          checked={groupPermissions.some(
            (permission) => permission.permission_codename === "generate_report_user",
          )}
          onChange={() => {}}
        />
      </div>
    </section>
  );
}
