import UserRegisterForm  from "../components/UserRegisterForm"
import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"

export default function CreateUserPage(){

    return(
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 w bg-gray-100 text-[#0C2D48] ">
                    <UserRegisterForm />    
                </main>

            </div>

        </div>
    )
}