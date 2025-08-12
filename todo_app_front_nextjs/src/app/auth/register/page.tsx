"use client"
import styles from "../auth.module.css";
import { useForm, SubmitHandler } from "react-hook-form"
import { signIn } from "@/api/authCalls";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

type Credentials = {
    username: string,
    password: string,
    birth_date: string,
    email: string,
}
export type CustomError = {
    message: string
}

const passwordValidations = {
    required: {
        message: "Campo requerido",
        value: true
    },
    minLength: {
        message: "La contraseña debe tener al menos 10 caracteres",
        value: 10
    },
    pattern: {
        message: "La contraseña debe tener al menos un dígito y una letra mayúscula",
        value: /^(?=.*[0-9])(?=.*[A-Z]).*$/,
    },
}

export default function Home() {
    const [serverAuthResponse, setServerAuthResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Credentials>();
    const onSubmit: SubmitHandler<Credentials> = async data => {
        setIsLoading(true)        
        setServerAuthResponse("")
        setTimeout(async () => {
            const error:CustomError = await signIn(data.username, data.password, data.email, data.birth_date)
            console.log(error);
            
            if (!error) {
                toast.success("Registrado correctamente!",{autoClose:2000})
                setTimeout(()=>{
                    redirect("/auth/login")
                },2000)
            } else {
                setServerAuthResponse(error.message)
            }
            setIsLoading(false)
        }, 2000)
    }

    return (
        <div className={styles.page}>
            <ToastContainer />
            <main className={styles.main}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <h1>Registrarse</h1>
                    <div className={styles.inputsContainer}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="">Usuario</label>
                            <input type="text" {...register("username", { required: true })} />
                            {errors.username && <span className={styles.errorMsg}>Campo requerido</span>}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="">Contraseña</label>
                            <input type="password" {...register("password", passwordValidations)}/>
                            {errors.password && <div className={styles.errorMsg}>{errors.password.message}</div> }
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="">Email</label>
                            <input type="email" {...register("email", { required: true })} />
                            {errors.email && <span className={styles.errorMsg}>Campo requerido</span>}
                        </div>                        
                        <div className={styles.inputContainer}>
                            <label htmlFor="">Fecha de nacimiento</label>
                            <input type="date" min="1930-01-01" max="2007-01-01" {...register("birth_date", { required: true })} />
                            {errors.birth_date && <span className={styles.errorMsg}>Campo requerido</span>}
                        </div>
                    </div>
                    <div className={styles.submitContainer}>
                        <button type="submit" className={styles.formSubmit} disabled={isLoading}>Registrarse</button>
                        <span className={styles.errorMsg}>{serverAuthResponse}</span>
                        {isLoading ? <ClipLoader /> : <></>}
                    </div>
                </form>
            </main>
        </div>
    )
}
