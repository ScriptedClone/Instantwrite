import { Link, useNavigate } from "react-router"
import { postSession } from "../services/api";

export default function LoginPage() {
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const res = await postSession(data)

        if(res.ok) {
            nav('/');
        } else {
            const error = await res.json()
            const errorMessage = error?.message;

            alert(errorMessage)
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
