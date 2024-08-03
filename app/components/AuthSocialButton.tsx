import { IconType } from "react-icons"
import Button from "./Button";

interface AuthSocialButtonProps {
    icon : IconType,
    onClick:()=>void;
}


const AuthSocialButton : React.FC<AuthSocialButtonProps>= ({icon : Icon ,onClick}) =>{

    return (
       <button type="button" onClick={onClick} className = "inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-inset ring-gray-300">
         <Icon/>
       </button> 
    )
}

export default AuthSocialButton