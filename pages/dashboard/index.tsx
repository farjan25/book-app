import { useEffect } from "react";
import IconGrid from "./ui/iconGrid";
import { useState } from "react";
import ProjectIcon from "./ui/projectIcon";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { userAgent } from "next/server";

export default function dashboard() {

    const router = useRouter()
    
    const checkLogin = async () =>{
        const { data, error } = await supabase.auth.getUser();

        if (data?.user) {
            console.log('User is logged in:', data.user.email);
            return true;
        } else {
            console.log('User is NOT logged in');
            router.push('login')
            return false;
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

    return(
        <div className="absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
            <div className="mx-auto text-4xl font-medium px-20 py-5 flex flex-col">
                My Dashboard
            </div>

            <div className="pl-6">
                <IconGrid />
            </div>
            
        </div>
    )
}