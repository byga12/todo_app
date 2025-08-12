"use client"
import s from "../page.module.css"
import Error from "next/error"
export default function error401(){
    return(
        <div className={s.page}>
            <Error statusCode={401} title="Acceso denegado"/>
        </div>
    )
}