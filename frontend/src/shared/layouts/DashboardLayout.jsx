import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 bg-background text-text-primary overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
