import { useState, useContext } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../../storage/fileSystem"
import { TreeActionsContext } from "./TreeActionsContext";
import RenameNode from "./RenameNode";


export default function Document({folderId, tree, node, index, 
                                  depth, renameIcon, deleteIcon}) {

    const { onDelete, onSelectDoc } = useContext(TreeActionsContext)
    const [isRenaming, setIsRenaming] = useState(false);

    const {ref} = useSortable({
        id: node.id,
        index: index,
        group: folderId,
        collisionPriority: depth,
        type: "text",
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree)
        }
    })
    
    function handleRenameToggle() {
        setIsRenaming(!isRenaming)
    }

    return (
        <li key={node.id} className="text" onClick={() => onSelectDoc(node.id)} ref={ref}>
            
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
                        e.stopPropagation() // Stop filetree component catching rename toggle event.
                        handleRenameToggle()
                }}/>
            </button>

        </li>
    )
}
