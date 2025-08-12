import "dotenv/config"
import express, { ErrorRequestHandler, NextFunction } from "express"
import { Request, Response } from "express"
import session from "express-session"
import { drizzle } from "drizzle-orm/libsql"
import { usersTable } from "./db/schema.js"
import { isAuthController, loginController, registerController } from "./controllers/auth.js"
import { addTodoController, getTodosController, patchTodoController, deleteTodoController } from "./controllers/todos.js"
import cors from "cors"
import CustomHttpError from "./utils/CustomHttpError.js"

const app = express()
const port = 4000
const db = drizzle(process.env.DB_FILE_NAME!);

// Para gestionar peticiones CORS
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
// Para poder leer el body de las requests
app.use(express.json());

// Session middleware
app.use(session({
    secret:process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción para HTTPS
        httpOnly: true,
        maxAge: 1000 * 1800 //10 segundos de cookie
    }
}))
// Auth middleware: Solo para rutas protegidas
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.session.isAuthenticated){
        next()
    } else {
        res.status(401).json({message:"Acceso no autorizado"})
    }
}

app.post("/auth/login", loginController)
app.post("/auth/register", registerController)
app.get('/',async (req,res)=>{
    res.send("Hola")
})
app.get("/profile", isAuthController)

app.get("/test",async (req:Request, res: Response, next: NextFunction)=>{
    try {
        const result = await db.insert(usersTable).values({
            username: "John",
            password: "12345",
            email: "john@hotmail.com",
            birth_date: "2000-12-28"
        })
        
    } catch(e){
        next(e)
    }
})


// Rutas protegidas
app.get("/todos", authMiddleware, getTodosController)
app.post("/todos", authMiddleware, addTodoController)
app.patch("/todos/:id", authMiddleware, patchTodoController)
app.delete("/todos/:id", authMiddleware, deleteTodoController)


// Error middleware, para manejo de errores, hay que definirlo a lo último
app.use((err: CustomHttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Error interno del servidor'

    res.status(statusCode).json({
        status:"error",
        message
    })
})
app.listen(4000,err=>{
    if(err){
        console.error(err)
    } else {
        console.log(`Servidor levantado en puerto ${port}`);
    }
})