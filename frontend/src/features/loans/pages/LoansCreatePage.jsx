import LoanRegisterForm  from "../components/LoanRegisterForm"
import Navbar  from "../../../shared/layouts/Navbar"
import Sidebar  from "../../../shared/layouts/Sidebar"


export default function LoansCreatePage() {
    return(
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-background text-text-primary">
                    <LoanRegisterForm />    
                </main>

            </div>

        </div>
    );
}

