import Navbar from "./components/Navbar";
import Sidenav from "./components/Sidenav";
import TabBar from "../components/TabBar";
import { TvMinimal } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function ConfigLayout({children}){
        const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidenav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 bg-background text-text-primary overflow-y-auto">
                    {children ?? <Outlet />}
                    <TabBar/>
                </main>
            </div>
        </div>
    );
}