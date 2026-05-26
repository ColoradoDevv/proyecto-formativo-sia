import { Tab } from '@headlessui/react';



function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TabBar() {
  const tabs = ['Editar Perfil', 'Marcas', 'Grupos'];

  return (
    <div className="w-full w-max-3xl mx-auto pt-10">
      <Tab.Group>


        <Tab.List className="flex space-x-10 border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'pb-3 text-sm font-semibold outline-none transition-all duration-200',
                  selected
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'border-b-2 border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700' 
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6 px-6">
          <Tab.Panel>Contenido de Editar Perfil</Tab.Panel>
          <Tab.Panel>Contenido de Marcas</Tab.Panel>
          <Tab.Panel> </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}