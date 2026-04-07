import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
import RmListPage from "./RmListPage";

export default function RmHomePage(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-gray-100">
                    <RmListPage />
                </main>

            </div>

        </div>
    );
}
