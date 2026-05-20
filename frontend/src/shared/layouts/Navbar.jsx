import { ChevronDown } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import { Link } from "react-router-dom";


export default function Navbar() {
    return(
        <div>
            <div className="bg-surface-hover px-6 border-b border-border grid grid-cols-2 items-center text-text-primary">
                <div>
                    <h1 className="text-h2 font-heading font-semibold">SIA - Inventario Teleínformatica</h1>
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
