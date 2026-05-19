import { ChevronDown } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import { Link } from "react-router-dom";


export default function Navbar() {
    return(
        <div>
            <div className="bg-white px-6 border-b border-gray-300 grid grid-cols-2 items-center text-[#0C2D48]">
                <div>
                    <h1 className="text-2xl font-bold">SIA - Inventario Teleínformatica</h1>
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    <Dropdown className="p-10">
                        <DropdownTrigger>
                                <span className="underline cursor-pointer">
                                    Administrador
                                </span>
                                <ChevronDown className="size-5 cursor-pointer m6" />
                        </DropdownTrigger>

                        <DropdownContent className="right-0 w-48">
                            <DropdownItem>
                                <Link to="/auth" className="block w-full">
                                    Auth
                                </Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/dashboard" className="block w-full">
                                    Dashboard
                                </Link>
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}