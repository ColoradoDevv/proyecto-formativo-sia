import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidenav";
import TabBar from "../components/TabBar";
import { useState } from "react";

export default function ConfigLayout(){
        const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidenav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 bg-background text-text-primary overflow-y-auto">
                    <TabBar/>
                </main>
            </div>
        </div>
    );
}
