import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"
import ListUserPage from "../../users/pages/ListUserPage"

export default function UserHomePage(){

    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 bg-gray-100">
                    <ListUserPage />
                </main>
            </div>

        </div>
    );
}