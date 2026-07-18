import { Routes, Route } from "react-router";
import Header from "./components/Header.jsx"
import PanelHolder from "./components/PanelHolder.jsx"
import EditorPage from "./pages/EditorPage.jsx";
import './App.css'
import HomePage from "./pages/HomePage.jsx";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/editor" element={<EditorPage />}/>
            </Routes>
        </>
    )
}