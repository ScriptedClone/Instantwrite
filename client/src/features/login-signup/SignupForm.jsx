import { Link } from "react-router"
import useForm from "./hooks/useForm"
import './loginSignup.css'

export default function SignupForm() {
    const { handleSubmit } = useForm("signup");

    return (

        <div className="authContainer">
            
            <form className="authForm" onSubmit={handleSubmit}>
                <h1>Create your account</h1>

                <div className="authInputContainer">
                    <span className="authInputTitle">username</span>
                    <input className="authInput" type="text" name="username" placeholder="enter username" autoComplete="username"/>
                </div>

                <div className="authInputContainer">
                    <span className="authInputTitle">email</span>
                    <input className="authInput" type="text" name="email" placeholder="enter email" autoComplete="email"/>
                </div>

                <div className="authInputContainer">
                    <span className="authInputTitle">password</span>
                    <input className="authInput" type="password" name="password" placeholder="enter password" autoComplete="new-password"/>
                </div>
                
                <button className="authSubmit">Signup</button>
                
                <div className="authRedirectContainer">
                    <span className="authRedirectSubtitle">Already have an account? </span>
                    <Link className="authRedirectLink" to="/login">login</Link>
                </div>
            </form>
        </div>

    )
}
