import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
// import Input from "../../../shared/layouts/Input";

// import ListCmPage from "./CmListPage";

export default function CmHomePage(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            
            <div className="flex flex-1">
                <Sidebar />
                   
                <main className="flex-1 bg-background">
                    
                    MARCAS
                    {/* <ListCmPage /> */}
                </main>

            </div>

        </div>
    );
}
