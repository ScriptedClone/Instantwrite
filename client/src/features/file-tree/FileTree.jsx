import { useRef, useState, useContext } from "react"
import { ProjectContext } from "../work-space/context/ProjectContext"
import { FileHoverContext } from "./context/FileHoverContext.js"
import { getFolderRoot } from "./fileTree.js"
import FolderChildren from "./FolderChildren"

export default function FileTree() {
    const { projectState } = useContext(ProjectContext)
    const { nodeMapRef } = projectState
    const rootIdRef = useRef(getFolderRoot(nodeMapRef.current))

    const [hoveredFileId, setHoveredFileId] = useState(false);
    const context = { hoveredFileId, handleHoveredFileId }

    function handleHoveredFileId(id) {
        setHoveredFileId(id)
    }

    return (
        <div className="fileTree">
            <FileHoverContext.Provider value={context}>
                <FolderChildren folderId={rootIdRef.current} depth={1}/> 
            </FileHoverContext.Provider>
        </div>
        
    )
}
