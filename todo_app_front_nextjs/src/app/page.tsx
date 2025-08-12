"use client"
import styles from "./page.module.css";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Organiza tu día</h1>
        <p>Crea listas de tareas y organiza tus actividades diarias de forma sencilla y eficiente</p>
        <div className={styles.containerBtn}>
          <Link href={"/auth/login"} className={styles.primaryBtn}>Iniciar sesión</Link>
          <Link href={"/auth/register"} className={styles.secondaryBtn}>Registrarse</Link>
        </div>
      </main>
    </div>
  );
}
