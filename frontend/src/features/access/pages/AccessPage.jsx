// frontend/src/features/access/pages/AccessPage.jsx
// Estado compartido entre Sidebar y PermissionModule.
// La edicion vive aqui: se trabaja sobre un borrador (draft) y solo se
// persiste al guardar, comparando el borrador contra el estado original.

import { useEffect, useState } from "react";
import AccessSidebar from "../components/AccessSideBar.jsx";
import PermissionModule from "../components/PermissionModule";
import { assignGroupPermission, removeGroupPermission } from "../services/groupService";
import { assignUserPermission, removeUserPermission } from "../services/userPermissionService";
import { showAlert } from "@/shared";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Permisos persistidos del destino seleccionado (la "verdad" del servidor).
  const [groupPermissions, setGroupPermissions] = useState([]);

  // Estado de edicion y borrador local sobre el que se hacen los cambios.
  const [isEditing, setIsEditing] = useState(false);
  const [permissionsDraft, setPermissionsDraft] = useState([]);
  const [saving, setSaving] = useState(false);

  // Cada vez que cambian los permisos cargados (al elegir otro grupo/usuario),
  // se reinicia el borrador y se sale del modo edicion.
  useEffect(() => {
    setPermissionsDraft(groupPermissions);
    setIsEditing(false);
  }, [groupPermissions]);

  const target = selectedGroup || selectedUser;

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setPermissionsDraft(groupPermissions);
    setIsEditing(false);
  }

  // Guarda solo los cambios: compara el borrador contra lo original y llama a
  // los endpoints de asignar/remover unicamente para lo que cambio.
  async function handleSave() {
    if (!target || saving) return;

    const originalCodes = new Set(groupPermissions.map((p) => p.codename));
    const draftCodes = new Set(permissionsDraft.map((p) => p.codename));

    const toAssign = [...draftCodes].filter((code) => !originalCodes.has(code));
    const toRemove = [...originalCodes].filter((code) => !draftCodes.has(code));

    if (toAssign.length === 0 && toRemove.length === 0) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const assign = selectedGroup
        ? (code) => assignGroupPermission(selectedGroup, code)
        : (code) => assignUserPermission(selectedUser, code);
      const remove = selectedGroup
        ? (code) => removeGroupPermission(selectedGroup, code)
        : (code) => removeUserPermission(selectedUser, code);

      // Para usuarios, un permiso puede venir heredado de un grupo: el backend
      // responde 404 al intentar quitarlo directamente. Ese caso se tolera
      // (allSettled) porque no es un error de persistencia real.
      const results = await Promise.allSettled([
        ...toAssign.map((code) => assign(code)),
        ...toRemove.map((code) => remove(code)),
      ]);

      const realError = results.find(
        (r) => r.status === "rejected" && r.reason?.status !== 404
      );
      if (realError) throw realError.reason;

      // El borrador pasa a ser la nueva verdad persistida.
      setGroupPermissions(permissionsDraft);
      setIsEditing(false);
      await showAlert({
        icon: "success",
        iconColor: "var(--color-success)",
        title: "Permisos actualizados correctamente",
      });
    } catch (error) {
      showAlert({
        icon: "error",
        iconColor: "var(--color-error)",
        title: "Error al guardar los permisos",
        text: error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">

      <AccessSidebar
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        groupPermissions={permissionsDraft}
        setGroupPermissions={setGroupPermissions}
        isEditing={isEditing}
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-h3 font-heading mb-4 sm:mb-6">Gestión de permisos</h2>

        <PermissionModule
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          isEditing={isEditing}
          saving={saving}
          permissionsDraft={permissionsDraft}
          setPermissionsDraft={setPermissionsDraft}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
