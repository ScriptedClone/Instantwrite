import { Link, useNavigate } from "react-router"

export default function SignupPage() {
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        const res = await fetch('/api/v1/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if(res.ok) {
            nav('/');
        }
    }

    return (

        <form action='/api/v1/users' method="POST" onSubmit={handleSubmit}>
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