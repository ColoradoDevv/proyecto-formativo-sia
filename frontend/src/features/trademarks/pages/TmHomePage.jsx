import Navbar from "../../../shared/layouts/Navbar";
import Sidebar from "../../../shared/layouts/Sidebar";
import { Switch } from "@/shared";
import { brands } from "../../trademarks/data/brands/brands.js";
// import Input from "../../../shared/layouts/Input";
import DetailCard from "../components/detail/DetailCard";
import DetailField from "../components/detail/DetailField";

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

                    <DetailCard title="Información de Contacto">
                        <DetailField    
                            label="Correo electrónico"  
                            value={brands.email}  
                        />
                        <DetailField    
                            label="Correo institucional"    
                            value={brands.institutionalEmail}     
                        />
                        <DetailField    
                            label="Teléfono"    
                            value={brands.phone}  
                        />
                        <DetailField    
                            label="Teléfono adicional"  
                            value={brands.additionalPhone}    
                        />
                        <DetailField    
                            label="Dirección"   
                            value={brands.addres ?? brands.address}     
                            fullWidth   
                        />
                    </DetailCard>

                </main>

            </div>

        </div>
    );
}
