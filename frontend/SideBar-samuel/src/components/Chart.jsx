import React from "react";
export default function Chart() {
  const data = [20, 30, 25, 40, 18, 28, 15];

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h3 className="mb-4 font-semibold">Actividad semanal</h3>

      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => (
          <div
            key={i}
            className="bg-primary w-8 rounded"
            style={{ height: d * 3 }}
          />
        ))}
      </div>
    </div>
  );
}