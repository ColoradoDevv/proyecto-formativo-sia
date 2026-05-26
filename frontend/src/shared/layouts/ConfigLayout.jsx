import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TabBar from "../components/TabBar";

export default function ConfigLayout(){
    return (
        <div className="h-screen flex flex-col">
            <Navbar />


            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-background">
                    <TabBar/>
                </main>

            </div>

        </div>
    );
}