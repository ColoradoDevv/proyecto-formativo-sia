import { useState } from "react";
import { Checkbox, AccordionItem } from "@/shared";
import { PERMISSION_MODULES } from "../constants/permissionModules";
import { assignGroupPermission, removeGroupPermission } from "../services/groupService";
import { assignUserPermission, removeUserPermission } from "../services/userPermissionService";

// Contador "X/Y" mostrado junto al título de cada módulo.
function ModuleHeader({ title, active, total }) {
  const allActive = active === total;
  return (
    <span className="flex items-center gap-3">
      <span>{title}</span>
      <span
        className={`text-caption font-medium px-2 py-0.5 rounded-[var(--radius-full)] ${
          active === 0
            ? "bg-surface-muted text-text-muted"
            : allActive
            ? "bg-text-primary text-text-inverse"
            : "bg-text-primary text-text-inverse"
        }`}
      >
        {active}/{total}
      </span>
    </span>
  );
}

export default function PermissionModule({ selectedGroup, selectedUser, groupPermissions, setGroupPermissions }) {
  const [pendingCodename, setPendingCodename] = useState(null);

  const target = selectedGroup || selectedUser;
  const hasPermission = (codename) =>
    groupPermissions.some((permission) => permission.codename === codename);

  const countActive = (permissions) =>
    permissions.filter((permission) => hasPermission(permission.codename)).length;

  async function togglePermission(codename) {
    if (!target || pendingCodename) return;

    setPendingCodename(codename);
    try {
      const isAssigning = !hasPermission(codename);

      if (selectedGroup) {
        if (isAssigning) await assignGroupPermission(selectedGroup, codename);
        else await removeGroupPermission(selectedGroup, codename);
      } else {
        if (isAssigning) await assignUserPermission(selectedUser, codename);
        else await removeUserPermission(selectedUser, codename);
      }

      setGroupPermissions((prev) =>
        isAssigning
          ? [...prev, { codename }]
          : prev.filter((permission) => permission.codename !== codename)
      );
    } catch (error) {
      console.error("Error actualizando permiso:", error);
    } finally {
      setPendingCodename(null);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[75vh] overflow-y-auto pr-2">
      {PERMISSION_MODULES.map((module) => (
        <AccordionItem
          key={module.title}
          title={
            <ModuleHeader
              title={module.title}
              active={countActive(module.permissions)}
              total={module.permissions.length}
            />
          }
          defaultOpen={module.title === "Gestión usuarios"}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-4">
            {module.permissions.map(({ codename, label }) => (
              <Checkbox
                key={codename}
                id={codename}
                name={codename}
                label={label}
                checked={hasPermission(codename)}
                disable={!target || pendingCodename === codename}
                onChange={() => togglePermission(codename)}
              />
            ))}
          </div>
        </AccordionItem>
      ))}
    </div>
  );
}
