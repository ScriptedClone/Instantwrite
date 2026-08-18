import { useState, useContext } from "react"
import { useDragOperation } from "@dnd-kit/react";
import { TreeActionsContext } from "./context/TreeActionsContext.js";
import { FileHoverContext } from "./context/FileHoverContext.js";
import FolderChildren from "./FolderChildren.jsx"
import RenameNode from "./RenameNode.jsx";
import useFolderDnd from "./hooks/useFolderDnd.jsx";


export default function Folder({folderId, node, index, 
                                depth, renameIcon, deleteIcon}) {
    const {source, target} = useDragOperation();
    const { onDelete, onSelectFolder } = useContext(TreeActionsContext)

    const { hoveredFileId, handleHoveredFileId } = useContext(FileHoverContext)
    const { ref } = useFolderDnd({node, index, folderId, depth})

    const [isRenaming, setIsRenaming] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    function handleRenameToggle(e) {
        setIsRenaming(!isRenaming)
    }

    function handleFolderToggle() {
        setIsOpen(!isOpen)
    }
    
    return (
        <li className="folder"
            key={node.id}
            ref={ref}
            onClick={(e) => {
                e.stopPropagation(); // Stop parent folder overwriting selection when event bubbles.
                onSelectFolder(node.id)
            }}
        >
            <div className={`folder file 
                 ${(hoveredFileId === node.id) ? "hoverFile" : ""}
                 ${(source && (target?.id === node.id + "|droppable") ? "hoverFolderDrop" : "")}
                `}

                 onMouseEnter={() => handleHoveredFileId(node.id)}
                 onMouseLeave={() => handleHoveredFileId(null)}
            >
                <span className={`folderToggleIcon ${(isOpen) ? "folderToggleActive" : "" }`} 
                      onClick={(e) => {
                    e.stopPropagation() // Stop onSelectFolder catching folder toggle.
                    handleFolderToggle()
                }}>
                    {">"}
                </span>
                
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
                            e.stopPropagation() // Stop onSelectFolder catching rename toggle.
                            handleRenameToggle()
                    }}/>
                </button>
            </div>
            {isOpen && <FolderChildren folderId={node.id}
                                       depth={depth + 1}/>} 
        </li>
    )
}
