import { useState, useContext } from "react"
import { TreeActionsContext } from "./TreeActionsContext.js";
import FolderChildren from "./FolderChildren"
import RenameNode from "./RenameNode";
import useFolderDnd from "./hooks/useFolderDnd";


export default function Folder({folderId, tree, node, index, 
                                depth, renameIcon, deleteIcon}) {
    
    const { onDelete, onSelectFolder } = useContext(TreeActionsContext)
    const [isRenaming, setIsRenaming] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { ref } = useFolderDnd({node, index, folderId, depth, tree})

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
            <span onClick={(e) => {
                  e.stopPropagation() // Stop onSelectFolder catching folder toggle.
                  handleFolderToggle()
            }}>
                {">"}
            </span>
            
            {(isRenaming) 
            ? <RenameNode node={node} handleRenameToggle={handleRenameToggle}/> 
            : node.name}

            <button className="deleteBtn">
                <img src={deleteIcon} 
                     alt="delete icon" 
                     className="deleteIcon"
                     onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                    }}
                />
            </button>

            <button className="renameBtn">
                <img src={renameIcon} 
                     alt="rename icon" 
                     className="renameIcon"
                     onClick={(e) => {
                        e.stopPropagation() // Stop onSelectFolder catching rename toggle.
                        handleRenameToggle()
                }}/>
            </button>

            {isOpen && <FolderChildren folderId={node.id}
                                       tree={tree}
                                       depth={depth + 1}/>} 
        </li>
    )
}
