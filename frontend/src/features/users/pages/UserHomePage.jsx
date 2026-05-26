import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"
import UserListPage from "../../users/components/list/UserListPage"

export default function UserHomePage(){

    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 bg-background">
                    <UserListPage />
                </main>
            </div>

        </div>
    );
}