import { Link, useNavigate } from "react-router"
import { postUser } from "../services/api";

export default function SignupPage() {
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const res = await postUser(data)

        if(res.ok) {
            nav('/');
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
