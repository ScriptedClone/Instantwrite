import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../../storage/fileSystem"
import RenameNode from "./RenameNode";

export default function Document({folderId, tree, node, index, 
                                  depth, renameIcon, deleteIcon}) {
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

    const [isRenaming, setIsRenaming] = useState(false);
    
    function handleRenameToggle() {
        setIsRenaming(!isRenaming)
    }

    return (
        <li key={node.id} className="text" data-id={node.id} ref={ref}>
            
            {(isRenaming) 
            ? <RenameNode node={node} handleRenameToggle={handleRenameToggle}/> 
            : node.name}
            
            <button className="deleteBtn">
                <img src={deleteIcon} 
                     alt="delete icon" 
                     className="deleteIcon"
                     data-id={node.id + "|deleteBtn"}     
                />
            </button>

            <button className="renameBtn">
                <img src={renameIcon} 
                     alt="rename icon" 
                     className="renameIcon"
                     data-id={node.id + "|renameBtn"}
                     onClick={handleRenameToggle}
                />
            </button>

        </li>
    )
}
