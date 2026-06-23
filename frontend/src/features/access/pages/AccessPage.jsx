// frontend/src/features/access/pages/AccessPage.jsx
// Corrección: estado compartido entre Sidebar y PermissionModule


import { useState } from "react";
import AccessSidebar from "../components/AccessSideBar.jsx";
import PermissionModule from "../components/PermissionModule";


export default function AccessPage() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupPermissions, setGroupPermissions] = useState([]);


  return (
    <div className="p-6 grid grid-cols-1 lg:flex gap-10 w-full">
      
      <AccessSidebar
      
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groupPermissions={groupPermissions}
        setGroupPermissions={setGroupPermissions}
      />


      <div className="flex-1">
        <h1 className="text-h2 font-heading mb-6">Gestión de permisos</h1>


        <PermissionModule
          selectedGroup={selectedGroup}
          groupPermissions={groupPermissions}
        />
      </div>
    </div>
  );
}
