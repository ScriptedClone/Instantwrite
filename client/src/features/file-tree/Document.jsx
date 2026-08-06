import { useState, useContext } from "react";
import { isNodeDescendant } from "./fileTree.js"
import { ProjectContext } from "../work-space/context/ProjectContext.js";
import { TreeActionsContext } from "./context/TreeActionsContext.js";
import { FileHoverContext } from "./context/FileHoverContext.js";
import RenameNode from "./RenameNode.jsx";
import useDocumentDnd from "./hooks/useDocumentDnd.jsx";


export default function Document({folderId, node, index, 
                                  depth, renameIcon, deleteIcon}) {

    const { onDelete, onSelectDoc } = useContext(TreeActionsContext);
    const { hoveredFileId, handleHoveredFileId } = useContext(FileHoverContext);
    const { docState } = useContext(ProjectContext);
    const { ref } = useDocumentDnd({node, index, folderId, depth});

    const [isRenaming, setIsRenaming] = useState(false);

    function handleRenameToggle() {
        setIsRenaming(!isRenaming)
    }

    return (
        <li key={node.id} 
            className={`document file 
                        ${(hoveredFileId === node.id) ? "hoverFile" : ""}
                        ${(docState.docNodeId === node.id) ? "activeFile" : ""}`}
            ref={ref}
            onClick={() => onSelectDoc(node.id)}
            onMouseEnter={(e) => {
                handleHoveredFileId(node.id);
            }}
            onMouseLeave={() => handleHoveredFileId(null)}
        >
            
            <span className="fileName">
                {(isRenaming) ? <RenameNode node={node} handleRenameToggle={handleRenameToggle}/> : node.name}
            </span>
            
            <button className={`deleteBtn ${(hoveredFileId === node.id) ? "hoverBtn" : ""}`}>
                <img src={deleteIcon} 
                     alt="delete icon" 
                     className="deleteIcon"
                     onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                    }}  
                />
            </button>

            <button className={`renameBtn ${(hoveredFileId === node.id) ? "hoverBtn" : ""}`}>
                <img src={renameIcon} 
                     alt="rename icon" 
                     className="renameIcon"
                     onClick={(e) => {
                        e.stopPropagation() // Stop onSelectDoc catching rename toggle.
                        handleRenameToggle()
                }}/>
            </button>

        </li>
    )
}
