import { useParams } from "react-router";
import Header from "../features/work-space/Header.jsx";
import Workspace from "../features/work-space/WorkSpace.jsx";
import "./css/editor.css"

export default function EditorPage() {
    const { projectId } = useParams();
   
    return (
        <>
            <Header />
            <Workspace projectId={projectId}/>
        </>
    )
}
