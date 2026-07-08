import { use, useEffect, useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { useDroppable, useDragOperation } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract"
import { isNodeDescendant } from "../../storage/fileSystem"
import FolderChildren from "./FolderChildren"
import RenameNode from "./RenameNode";

/**
 * to do
 * - Folder becomes droppable when empty or closed.
 * - Need to implement how to know if folder is empty. 
 */

export default function Folder({folderId, tree, node, index, 
                                depth, renameIcon, deleteIcon,
                                isFolderDroppable, children}) {
    const [isEmpty, setIsEmpty] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const {ref: sortable} = useSortable({
        id: node.id,
        index: index,
        group: folderId,
        collisionPriority: depth,
        type: "folder",
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree)
        }
    })

    const {ref: droppable} = useDroppable({
        id: node.id + "droppable",
        type: "folder",
        collisionPriority: CollisionPriority.Low,
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree)
        }
    })

    function handleRenameToggle(e) {
        setIsRenaming(!isRenaming)
    }

    function handleFolderToggle() {
        setIsOpen(!isOpen)
    }
    
    useEffect(() => {
        setIsEmpty(tree[node.id].length === 0);
    },[tree])
    
    return (
        <li className="folder" 
            key={node.id}  
            data-id={node.id} 
            ref={sortable}
        >
            <span onClick={(e) => {
                  e.stopPropagation() // Stop filetree component catching folderToggle event.
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
                     data-id={node.id + "|deleteBtn"}     
                />
            </button>

            <button className="renameBtn">
                <img src={renameIcon} 
                     alt="rename icon" 
                     className="renameIcon"
                     onClick={(e) => {
                        e.stopPropagation()
                        handleRenameToggle()
                }}/>
            </button>

            {isOpen && <FolderChildren folderId={node.id}
                                       tree={tree}
                                       depth={depth + 1}
                                       isFolderDroppable={isFolderDroppable}
                                       children={children}/>} 
        </li>
    )
}
