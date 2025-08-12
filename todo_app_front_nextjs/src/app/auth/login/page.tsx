"use client"
import styles from "../auth.module.css";
import { useForm, SubmitHandler } from "react-hook-form"
import { login } from "@/api/authCalls";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

type Credentials = {
  username: string,
  password: string
}
type Error = {
  message: string
}

export default function Home() {
  const [serverAuthResponse, setServerAuthResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Credentials>();
  const onSubmit: SubmitHandler<Credentials> = async data => {
    setIsLoading(true)
    setServerAuthResponse("")
    setTimeout(async ()=>{
      const error: Error = await login(data.username, data.password)
      if (!error) {
        redirect("/todos")
      } else {
        setServerAuthResponse(error.message)
      }
      setIsLoading(false)

    },2000)

  }

  return(
    <div className={styles.page}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h1>Iniciar sesión</h1>
          <div className={styles.inputsContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor="">Usuario</label>
              <input type="text" {...register("username", { required: true })}/>
              {errors.username && <span className={styles.errorMsg}>Campo requerido</span>}
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="">Contraseña</label>
              <input type="password" {...register("password",{ required: true })}/>
              {errors.password && <span className={styles.errorMsg}>Campo requerido</span>}
            </div>
          </div>
          <div className={styles.submitContainer}>
            <button type="submit" className={styles.formSubmit} disabled={isLoading}>Iniciar sesión</button>
            <span className={styles.errorMsg}>{serverAuthResponse}</span>
            {isLoading ? <ClipLoader/> : <></>}
          </div>
        </form>
      </main>
    </div>
  )
}
