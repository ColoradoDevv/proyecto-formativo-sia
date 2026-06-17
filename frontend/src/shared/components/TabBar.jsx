import { Tab } from '@headlessui/react';
import  TmHomePage  from "../../features/trademarks/pages/TmHomePage";
import {AccessPage} from "@/features/access"




function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TabBar() {
  const tabs = ['Editar Perfil', 'Marcas', 'Grupos'];

  return (
    <div className="w-full w-max-3xl mx-auto pt-10">
      <Tab.Group>


        <Tab.List className="flex space-x-10 border-b border-border px-6">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'pb-3 text-small font-medium outline-none transition-all duration-[var(--duration-base)]',
                  selected
                    ? 'border-b-2 border-brand text-text-primary'
                    : 'border-b-2 border-transparent text-text-muted hover:border-border-strong hover:text-text-secondary'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6 px-6">
          <Tab.Panel>
            Contenido de Editar Perfil
            
              </Tab.Panel>
          <Tab.Panel>
            <TmHomePage/>
          </Tab.Panel>



          <Tab.Panel> <AccessPage/> </Tab.Panel>
        </Tab.Panels> 
      </Tab.Group>
    </div>
  );
}