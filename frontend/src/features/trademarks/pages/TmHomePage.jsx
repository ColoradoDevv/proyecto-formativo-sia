import { useNavigate } from "react-router-dom";
import { Button, SearchField } from '@/shared';
import DetailCard from '../components/detail/DetailCard';
import { Funnel, Plus, ArrowLeft, ArrowRight } from "lucide-react";

export default function TmHomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex">
      <div className="flex flex-1">
        <main className="flex-1 space-y-6 bg-background">

          {/* bottom */}
          <div className="grid grid-cols-2  h-20 gap-140 items-center"> 
          <SearchField
            placeholder="Buscar..."
            variant="outlined"
            
          />          
          <div className="space-x-2 justify-self-end">
            <Button
              // to="/devolutivos/crear"
              className="self-start md:self-auto"
            >
              Filtrar
              {/* <Funnerl/> */}
              <Funnel size={18}/> 
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/marcas/registrar-marca")}
              className="self-start md:self-auto"
            >
              Registrar Marca
              <Plus size={18}/>
            </Button>
            </div>
          </div>

          {/* MARCAS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <DetailCard title="BOSS" />
              <DetailCard title="DeWalt" />
              <DetailCard title="MilWauke" />
              <DetailCard title="Hilti" />
            </div>
            <div className="space-y-4">
              <DetailCard title="Festool" />
              <DetailCard title="Black+Decker" />
              <DetailCard title="Ryobi" />
              <DetailCard title="Craftsman" />
            </div>
          </div>

          {/* DOWN */}
          <div className="grid grid-cols-2 h-20 gap-220 items-center">
            <Button
              // to="/devolutivos/crear"
              className="md:self-auto"
            >
              <ArrowLeft/>
              Atras
              
              {/* <Funnerl/> */}
            </Button>

            <Button
              // data={Rm}
              // reportConfig={returnablesReportConfig}
              className="md:self-auto"
            >
              Siguiente
              <ArrowRight/>
              </Button>
            </div>

        </main>
      </div>
    </div>
  );
}
