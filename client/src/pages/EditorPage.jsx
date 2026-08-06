import { useParams, useLocation } from "react-router";
import Header from "../components/Header.jsx";
import Workspace from "../features/work-space/WorkSpace.jsx";
import "./css/editor.css"

export default function EditorPage() {
    const { projectId } = useParams();
const { projectName } = useLocation().state
   
    return (
        <div className="editorPage">
            <Header page={"editor"} projectName={projectName}/>
            <Workspace projectId={projectId}/>
        </div>
    )
}
