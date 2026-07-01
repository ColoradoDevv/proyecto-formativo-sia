import { Tab } from '@headlessui/react';
import  TmHomePage  from "../../features/trademarks/pages/TmHomePage";
import {AccessPage} from "@/features/access"
import { TaskHomePage } from "@/features/tasks"




function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TabBar() {
  const tabs = ['Editar Perfil', 'Marcas', 'Grupos', 'Tareas'];

  return (
    <div className="w-full pt-4 sm:pt-6">
      <Tab.Group>


        <Tab.List className="grid grid-cols-4  border-b border-border px-4 sm:px-6" >
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'flex-1 pb-3 text-primary font-medium text-center outline-none transition-all cursor-pointer duration-(--duration-base)',
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

        <Tab.Panels className="mt-6 px-4 sm:px-6">
          <Tab.Panel>
            Editar Perfil
          </Tab.Panel>
          <Tab.Panel>
            <TmHomePage/>
          </Tab.Panel>



          <Tab.Panel> <AccessPage/> </Tab.Panel>

          <Tab.Panel> <TaskHomePage/> </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
