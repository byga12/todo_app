import { Request, Response  } from "express"
import { SelectUser } from "../db/schema.js";
import * as schema from "../db/schema.js";
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client";
import "dotenv/config"
import { and, eq } from "drizzle-orm";
import { NextFunction } from "express";
import CustomHttpError from "../utils/CustomHttpError.js";
declare module 'express-session' {
    // Aquí extendemos la interfaz SessionData que proviene de la librería 'express-session'
    interface SessionData {
        userId?: number;      // Propiedad opcional para el ID del usuario
        username?: string;    // Propiedad opcional para el nombre de usuario
        isAuthenticated?: boolean; // Propiedad opcional para el estado de autenticación
    }
}
interface UserLoginRequestBody {
    username: string;
    password: string;
}
interface UserRegisterRequestBody {
    username: string;
    password: string;
    birth_date: string;
    email: string;
}
const client = createClient({ url: process.env.DB_FILE_NAME! })
const db = drizzle(client, { schema });
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password }: UserLoginRequestBody = req.body
        const user : SelectUser|undefined = await db.query.usersTable.findFirst({
            where: (and(
                eq(schema.usersTable.username, username),
                eq(schema.usersTable.password, password)
            ))
        })
        if (user) {
            req.session.userId = user.id
            req.session.username = user.username
            req.session.isAuthenticated = true
            req.session.save(err => {
                if (err) {
                    next(err)
                }
            })
            res.status(200).json({ message: "Autenticado correctamente" })
        } else {
            res.status(401).json({ message: "Usuario y/o contraseña incorrectos" })
        }
    } catch (e) {
        next(e)
    }
    
}


export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email, birth_date }: UserRegisterRequestBody = req.body
        // Validamos que la contraseña cumpla las restricciones, el resto lo valida las restricciones del mismo ORM (username único, email único, y que ningún campo venga vacío)
        if(password.length < 10 || !/\d/.test(password) || password===password.toLowerCase()){
            throw(new CustomHttpError("Error al validar los campos",400))
        }
        await db.insert(schema.usersTable).values(({
            username,
            password,
            email,
            birth_date
        }));
        res.status(201).json({ message: "Registrado correctamente" })
    } catch (e) {
        next(e)
    }
}

export const isAuthController = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.isAuthenticated) {
        res.status(200).json({ message: "Acceso autorizado"})
    } else {
        res.status(401).json({ message: "Acceso no autorizado" })
    }
}

