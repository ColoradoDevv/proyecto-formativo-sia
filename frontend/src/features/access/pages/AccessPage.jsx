// frontend/src/features/access/pages/AccessPage.jsx
// Corrección: estado compartido entre Sidebar y PermissionModule


import { useState } from "react";
import AccessSidebar from "../components/AccessSidebar";
import PermissionModule from "../components/PermissionModule";


export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);


  return (
    <div className="p-6 flex gap-10">
      <AccessSidebar
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groupPermissions={groupPermissions}
        setGroupPermissions={setGroupPermissions}
      />


      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-6">Gestión de permisos</h1>


        <PermissionModule
          selectedGroup={selectedGroup}
          groupPermissions={groupPermissions}
        />
      </div>
    </div>
  );
}
