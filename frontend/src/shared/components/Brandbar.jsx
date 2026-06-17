import { Link } from "react-router-dom";
import  Switch  from "../components/Switch";
import { Pencil } from "lucide-react";
// import { Sidebar } from "../layouts/Sidebar";


export default function Brandbar({
    children = "Barrademarca",
    className = "",
    to,
    type = "button",
    ...props
}) {
    const baseClassName = `
    grid grid-cols-3 
    // box vert size
    h-20  
    items-center gap-160 rounded-full
    border-2
    bg-background
    px-10 text-medium
    font-medium text-text-primary transition-colors duration-200 
    hover:bg-surface-muted
    focus:outline-none active:outline-none
    
    ${className}
    
    `.trim();

    return (
        <button
            type={type}
            className={baseClassName}
            {...props}
        >
            <span>{children}</span>
            
            {/* <Pencil size={18} strokeWidth={2.5} aria-hidden="true" /> */}
            <Switch 
            className="inline-flex"/>
   
                
            {/* <div className="flex justify-evenly">

                
            </div> */}

        </button>
        
    );

}