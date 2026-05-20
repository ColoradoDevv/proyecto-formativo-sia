import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
import ListCmPage from "./CmListPage";

export default function CmHomePage(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-background">
                    <ListCmPage />
                </main>

            </div>

        </div>
    );
}
