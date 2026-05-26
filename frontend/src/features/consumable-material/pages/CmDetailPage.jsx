import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
import CmDetailView from "../components/detail/UserDetailView";

export default function CmDetailPage() {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-background text-text-primary">
                    <CmDetailView />
                </main>
            </div>
        </div>
    );
}
