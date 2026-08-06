import { Link, useNavigate } from "react-router"
import { postUser } from "./services/authAPI"
import './auth.css'

export default function SignupForm() {
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = Object.fromEntries(new FormData(e.target));
            const res = await postUser(data)
            
            nav('/home')
        } catch (error){
            alert(error.message)
        }
    }

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
                

                <span className="authRedirectToLogin">Already have an account? <Link to="/login">login</Link></span>

            </form>
        </div>

    )
}
