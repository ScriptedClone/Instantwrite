import { Link } from "react-router"
import useForm from "./hooks/useForm"
import './loginSignup.css'

export default function LoginForm() {
    const { handleSubmit } = useForm("login");

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
                
                <div className="authRedirectContainer">
                    <span className="authRedirectSubtitle">Need an account? </span>
                    <Link className="authRedirectLink" to="/signup">signup</Link>
                </div>
            </form>
        </div>

    )    
}