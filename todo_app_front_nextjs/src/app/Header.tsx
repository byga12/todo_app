"use client"
import { redirect } from "next/navigation";
import s from "./header.module.css";
import icon from "./icon.svg"
import Image from "next/image";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/api/authCalls";

export default function Header(){
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() =>{
        const f = async ()=>{
            setIsAuth(await isAuthenticated())
        }
        f()
    },[])

    return(
        <header className={s.header}>
            <div className={s.homeBtn} onClick={()=>redirect("/")}>
                <Image className={s.homeIcon} src={icon} alt="" width={20}/>
                <p className={s.homeTitle}>TaskMaster</p>
            </div>
                {isAuth &&
                    <div className={s.rightPanel}>
                        <li>a</li>
                        <li>a</li>
                        <li>a</li>
                        <li>a</li>
                    </div>
                }
        </header>
    )
}