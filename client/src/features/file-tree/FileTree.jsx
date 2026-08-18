import { useRef, useState, useContext } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { useDragOperation } from "@dnd-kit/react";
import { TreeActionsContext } from "./context/TreeActionsContext.js";
import { ProjectContext } from "../work-space/context/ProjectContext"
import { FileHoverContext } from "./context/FileHoverContext.js"
import { getFolderRoot, isNodeDescendant } from "./fileTree.js"
import FolderChildren from "./FolderChildren"
import { useRootDnd } from "./hooks/useRootDnd.jsx";
import { ROOT_FOLDER_DEPTH } from "./const/depth.js";

export default function FileTree() {
    /** Find file-tree root node id using nodeMapRef */
    const { projectState } = useContext(ProjectContext);
    const { nodeMapRef } = projectState;
    const rootIdRef = useRef(getFolderRoot(nodeMapRef.current));

    /** Enable per file hover. */
    const [hoveredFileId, setHoveredFileId] = useState(false);
    const context = { hoveredFileId, handleHoveredFileId };

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
