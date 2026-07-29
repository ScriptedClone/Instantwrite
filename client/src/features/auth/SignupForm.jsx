import { Link, useNavigate } from "react-router"
import { postUser } from "./services/authAPI"

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

        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="username" placeholder="Username" autoComplete="username"/>
            </div>
            <div>
                <input type="text" name="email" placeholder="Email" autoComplete="email"/>
            </div>
            <div>
                <input type="password" name="password" placeholder="password" autoComplete="new-password"/>
            </div>
            <button>Submit</button>
        </form>

    )
}
