import { Link } from "react-router"

export default function LandingPage() {
    return (
        <>
            <div>
                <Link to="/signup">to signup</Link><br/>
                <Link to="/login">to login</Link><br/>
                <Link to="/home">to home</Link><br/>
            </div>
        </>
    )
}
