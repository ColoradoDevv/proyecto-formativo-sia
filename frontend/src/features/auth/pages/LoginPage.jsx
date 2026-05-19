import bgLogin from "@/assets/images/auth/bg-login.png"
import LoginForm from "../components/LoginForm"

export default function LoginPage() {
    return(
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgLogin})` }}>
            <div className="
                relative  
                -z-1          
                // bg-neutral-950/80 
                backdrop-blur-[1px] 
                shadow-lg 
                rounded-2xl 
                overflow-hidden 
                hover:shadow-black 
                transition-shadow 
                duration-700 ">
                <LoginForm />
            </div>
        </div>
    )
}