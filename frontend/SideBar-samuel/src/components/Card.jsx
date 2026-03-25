import React from "react";
export default function Card({ titulo, valor }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{titulo}</p>
      <h3 className="text-2xl font-bold text-primary mt-2">{valor}</h3>
    </div>
  );
}