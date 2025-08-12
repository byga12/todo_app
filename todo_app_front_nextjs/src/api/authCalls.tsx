import axios from "axios";

export const login = async (username:string, password:string) => {
    let error = null
    try {
        const res = await axios.post("http://localhost:4000/auth/login", { username, password }, { withCredentials:true })
        console.log(res);
        
    } catch(e:any){
        error = e.response.data
    }
    return error
}

export const signIn = async (username:string, password:string, email:string, birth_date:string) => {
    let error = null
    try {
        const res = await axios.post("http://localhost:4000/auth/register", { username, password, email, birth_date }, { withCredentials: true })
    } catch(e:any){
        error = e.response.data
    }
    return error
}

export const isAuthenticated = async () : Promise<boolean> => {
    try {
        await axios.get("http://localhost:4000/profile", { withCredentials: true })
        return true
    } catch (e) {
        return false
    }
}

export interface todo {
    title:string,
    description:string,
    creationDate:string,
    archived:boolean,
    id:number,
    userId:number
}
export const getTodosByUser = async (): Promise<todo[]> =>   {
    try {
        const res = await axios.get("http://localhost:4000/todos", { withCredentials:true })
        return res?.data
    } catch (error) {
        console.log(error);
        return []
    }
}