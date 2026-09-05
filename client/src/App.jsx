import { Routes, Route, useNavigate } from "react-router";
import { setNavigate } from "./util/helpers/navigation.js";
import { useEffect } from "react";
import RequireGuest from "./routes/RequireGuest.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Error404Page from "./pages/Error404Page.jsx";
import "./app.css"

export default function App() {
    /** Used for session expire redirect */
    const nav = useNavigate()
    useEffect(() => {
        setNavigate(nav)
    }, [nav])

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />}/>
                
                <Route element={<RequireGuest />}>
                    <Route path="/signup" element={<SignupPage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                </Route>

                <Route element={<RequireAuth />}>
                    <Route path="/editor/:projectId" element={<EditorPage />}/>
                    <Route path="/home" element={<HomePage />}/>
                </Route>
                
                <Route path="/*" element={<Error404Page />}/>
            </Routes>
        </>
    )
}
