import { useState, useContext } from "react";
import { isNodeDescendant } from "../../storage/fileTree"
import { TreeActionsContext } from "./TreeActionsContext.js";
import RenameNode from "./RenameNode";
import useDocumentDnd from "./hooks/useDocumentDnd";


export default function Document({folderId, tree, node, index, 
                                  depth, renameIcon, deleteIcon}) {

    const { onDelete, onSelectDoc } = useContext(TreeActionsContext)
    const [isRenaming, setIsRenaming] = useState(false);
    const { ref } = useDocumentDnd({node, index, folderId, depth, tree});
    
    function handleRenameToggle() {
        setIsRenaming(!isRenaming)
    }

    return (
        <li key={node.id} 
            className="text" 
            ref={ref}
            onClick={() => onSelectDoc(node.id)}>
            
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
                        e.stopPropagation() // Stop onSelectDoc catching rename toggle.
                        handleRenameToggle()
                }}/>
            </button>

        </li>
    )
}
