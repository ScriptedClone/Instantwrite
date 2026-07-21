import { Link } from "react-router"
import { deleteSession } from "../services/api";

export default function HomePage() {
    async function handleLogout(e) {
        e.preventDefault();

        try {
            const res = await deleteSession();
            alert(res.message);
        } catch ( error ) {
            alert(error.message)
        }
    }

    return (
        <>
            <div>
                <Link to="/signup">to signup</Link><br/>
                <Link to="/login">to login</Link><br/>
                <Link to="/editor">to editor</Link><br/>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )
}