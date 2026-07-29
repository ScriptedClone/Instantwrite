import { Link, useNavigate} from "react-router"
import { postSession } from "./services/authAPI"

export default function LoginForm() {
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = Object.fromEntries(new FormData(e.target));
            const res = await postSession(data)
            
            nav('/home')
        } catch (error){
            alert(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="email" placeholder="Email" autoComplete="email"/>
            </div>
            <div>
                <input type="password" name="password" placeholder="password" autoComplete="new-password"/>
            </div>
            <button>Login</button>
        </form>
    )    
}