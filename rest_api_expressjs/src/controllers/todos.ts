import { Response, Request, NextFunction } from "express"
import * as schema from "../db/schema.js";
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client";
import "dotenv/config"
import { and, eq, ne } from "drizzle-orm";

const client = createClient({ url: process.env.DB_FILE_NAME! })
const db = drizzle(client, { schema });

export const getTodosController = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const result = await db.query.todosTable.findMany({
            where: eq(schema.todosTable.userId, Number(req.session.userId))
        })
        res.status(200).send(JSON.stringify(result))
    } catch (e) {
        next(e)
    }

}

interface TodoAddBody {
    title:string,
    description:string|undefined
}

export const addTodoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description }: TodoAddBody = req.body
        const result = await db.insert(schema.todosTable).values({
            title: title,
            userId: Number(req.session.userId),
            creationDate: new Date().toString(),
            description: description,
            done: false,
        })
        res.status(201).send("Tarea cargada con éxito!")
    } catch (e) {
        next(e)
    }

}



export const patchTodoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body
        const id = Number(req.params.id)
        if (!id || !body) {
            res.status(403).json({ error: "No se encontró un id y/o cuerpo en la solicitud" })
        }
        await db.update(schema.todosTable)
            .set({ ...body })
            .where(eq(schema.todosTable.id, id))
        res.status(200).json({ message: "Tarea actualizada correctamente" })
    } catch (e) {
        next(e)
    }
    
}

export const deleteTodoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) {
            res.status(403).json({ error: "No se encontró un id en la solicitud" })
        }
        await db.delete(schema.todosTable).where(eq(schema.todosTable.id, id))  
        res.status(200).json({ message: "Tarea eliminada con éxito" })
    } catch (e) {
        next(e)
    }

}