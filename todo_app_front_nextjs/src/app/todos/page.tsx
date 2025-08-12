"use client"
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getTodosByUser, isAuthenticated } from "@/api/authCalls";
import { todo } from "@/api/authCalls";
import { redirect } from "next/navigation";

export default function Home() {
    const [isAuth, setIsAuth] = useState(false)
    const [todos, setTodos] = useState<todo[]>([])
    useEffect(() => {
        const f = async ()=>{
            const ok = await isAuthenticated()
            setIsAuth(ok)
            if(ok){
                const res: todo[] = await getTodosByUser()
                setTodos(res)
            } else {
                redirect("/pages/401")
            }
        }
        f()
    },[])

    return (
        <div className={styles.page}>
            {isAuth &&
                <div>
                    AUTENTICADO
                    {todos.map((todo:todo) =><div key={todo.id}>esto es un todo</div>)}
                </div>
            }
        </div>
    );
}
