import CmRegisterForm  from "../components/CmRegisterForm"
import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"

export default function RmCreatePage(){

    return(
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 w bg-gray-100 text-[#0C2D48] ">
                    <CmRegisterForm />    
                </main>

            </div>

        </div>
    )
}