import { ChevronDown } from "lucide-react"

export default function Navbar() {
    return(
        <div>
            <div className="bg-white p-6 border-b border-gray-300 grid grid-cols-2 items-center text-[#0C2D48]">
                <div>
                    <h1 className="text-2xl font-bold">SIA - Inventario Teleínformatica</h1>
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    <span className="underline cursor-pointer">
                        Administrador
                    </span>
                    <ChevronDown className="size-5 cursor-pointer m6" />
                </div>
            </div>
        </div>
    )
}