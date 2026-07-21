import { Routes, Route } from "react-router";
import EditorPage from "./pages/EditorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import './App.css'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/signup" element={<SignupPage />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/editor" element={<EditorPage />}/>
            </Routes>
        </>
    )
}