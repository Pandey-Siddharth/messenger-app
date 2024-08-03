"use client";

import { error } from "console";
import  Input  from "../components/Input";
import { useCallback, useState ,useEffect} from "react";
import { FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import AuthSocialButton from "../components/AuthSocialButton";
import { BsGithub, BsGoogle, BsTwitter } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type variant = 'Login' | 'Register';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant , setVariant] = useState<variant>('Login');
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        if(session?.status === 'authenticated'){
            console.log('authenticated');
            router.push('/users');
        }
    },[session?.status,router])
        
    const toggleVariant = useCallback(()=>{
        if(variant === 'Login'){
            setVariant("Register");
        }else{
            setVariant("Login");
        }
    },[variant]);

    const {register,
        handleSubmit,
        formState : {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues:{
            name : "",
            email : "",
            password : ""
        }
    });
    const onsubmit : SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true);
        if(variant === 'Register'){
            axios.post('api/register',data).catch(()=>{
                toast.error("Something went wrong !")
            }).then(() => signIn('credentials',data)).finally(()=> setIsLoading(false));
        }
        if(variant === "Login"){
            signIn('credentials',{
                ...data,
                redirect : false
            }).then((callback) => {
                if(callback?.error){
                    toast.error('Invalid credentials')
                }
                if(callback?.ok && !callback?.error){
                    toast.success('Success')
                }
            }).finally(()=> setIsLoading(false));
        }
    }

    const socialAction = (action : string)=>{
        setIsLoading(true);

        signIn(action,{redirect:false}).then((callback) => {
            if(callback?.error){
                toast.error('Invalid credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Success')
            }
        }).finally(()=> setIsLoading(false));
    }

    return (
        <div className="mt-8
        sm:max-auto
        sm:w-full
        sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onsubmit)}>
                    {variant === 'Register' && (
                    <Input id = "name" label="Name" register = {register} errors={errors}></Input>)}
                    <Input id = "email" label="Email-Address" type= "email" register = {register} errors={errors}></Input>
                    <Input id = "password" label="Password" type="password" register = {register} errors={errors}></Input>
                    <div>
                        <Button disabled= {isLoading} fullWidth = {true} type="submit">{variant === "Login" ? "Sign In": "Register"}</Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500"> or continue</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                <AuthSocialButton icon = {BsGithub}   onClick={()=>{socialAction("github")}}/>
                <AuthSocialButton icon = {BsTwitter}   onClick={()=>{socialAction("twitter")}}/>
                <AuthSocialButton icon = {BsGoogle}   onClick={()=>{socialAction("google")}}/>
                </div>
                <div className="flex justify-center mt-4 text-gray-500 text-sm">
                        <div className="">
                            {variant === "Login"?" New to Messenger?":"Already Registered?"}
                        </div>
                        <div onClick={toggleVariant} className="cursor-pointer underline px-2">
                            {variant === "Login"? " Create an Account": "Login"}
                        </div>
                </div>
            </div>
        </div>
    );
}


export default AuthForm