import { Link, useNavigate} from "react-router"
import { postSession } from "./services/authAPI"
import './auth.css'

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
        <div className="authContainer">
            <form className="authForm" onSubmit={handleSubmit}>
                <h1>Welcome back</h1>

                <div className="authInputContainer">
                    <span className="authInputTitle">email</span>
                    <input className="authInput" type="text" name="email" placeholder="Email" autoComplete="email"/>
                </div>

                <div className="authInputContainer">
                    <span className="authInputTitle">password</span>
                    <input className="authInput" type="password" name="password" placeholder="password" autoComplete="new-password"/>
                </div>

                <button className="authSubmit">Login</button>
                
                <span className="authRedirectToLogin">Need an account? <Link to="/signup">signup</Link></span>
            </form>
        </div>

    )    
}