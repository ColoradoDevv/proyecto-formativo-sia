import React from "react";
export default function Table({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

    

      <h3 className="mb-4 font-semibold">Últimas Transacciones</h3>

      <table className="w-full text-sm">

        <thead>
          <tr className="text-gray-500 border-b">
            <th className="text-left py-2">Fecha</th>
            <th>Artículo</th>
            <th>Acción</th>
            <th>Usuario</th>
            <th>Notas</th>
          </tr>
        </thead>

        <tbody>
            
          {data.map((item, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="py-2">{item.fecha}</td>
              <td>{item.articulo}</td>
              <td className="text-primary">{item.accion}</td>
              <td>{item.usuario}</td>
              <td className="text-gray-400">OK</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}