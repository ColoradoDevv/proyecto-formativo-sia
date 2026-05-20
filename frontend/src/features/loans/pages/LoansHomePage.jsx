import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
import ListPage from "./LoansListPage";

export default function LoansHomePage(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-background">
                    <ListPage />
                </main>

            </div>

        </div>
    );
}
