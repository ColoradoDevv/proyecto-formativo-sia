// frontend/src/features/access/pages/AccessPage.jsx
// Estado compartido entre Sidebar y PermissionModule

import { useState } from "react";
import AccessSidebar from "../components/AccessSideBar.jsx";
import PermissionModule from "../components/PermissionModule";

export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);

  return (
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">

      <AccessSidebar
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        groupPermissions={groupPermissions}
        setGroupPermissions={setGroupPermissions}
      />

      <div className="flex-1 min-w-0">
        <h2 className="text-h3 font-heading mb-4 sm:mb-6">Gestión de permisos</h2>

        <PermissionModule
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          groupPermissions={groupPermissions}
          setGroupPermissions={setGroupPermissions}
        />
      </div>
    </div>
  );
}
