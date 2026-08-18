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
    /** Set current folder to root when empty space is clicked in file-tree.*/
    const { onSelectFolder } = useContext(TreeActionsContext);
    
    /** Drag and drop operations for file-tree as root folder. */
    const { folderChildMap } = projectState
    const { ref } = useRootDnd({rootIdRef, nodeMapRef, folderChildMap});

    function handleHoveredFileId(id) {
        setHoveredFileId(id)
    }

    return (
        <div className="fileTree" ref={ref} onClick={(e) => onSelectFolder(rootIdRef.current)}>
            <FileHoverContext.Provider value={context}>
                <FolderChildren folderId={rootIdRef.current} depth={ROOT_FOLDER_DEPTH}/> 
            </FileHoverContext.Provider>
        </div>
        
    )
}
