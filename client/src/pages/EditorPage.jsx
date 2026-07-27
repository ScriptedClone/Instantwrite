import { useParams } from "react-router";
import Header from "../components/Header.jsx";
import Workspace from "../features/work-space/WorkSpace.jsx";
import "./css/editor.css"

export default function EditorPage() {
    const { projectId } = useParams();
   
    return (
        <div className="editorPage">
            <Header page={"editor"}/>
            <Workspace projectId={projectId}/>
        </div>
    )
}
