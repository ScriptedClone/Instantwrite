import { Routes, Route } from "react-router";
import EditorPage from "./pages/EditorPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import './App.css'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />}/>
                <Route path="/signup" element={<SignupPage />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/editor" element={<EditorPage />}/>
            </Routes>
        </>
    )
}
