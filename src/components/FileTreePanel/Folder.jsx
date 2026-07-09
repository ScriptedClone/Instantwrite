import { use, useEffect, useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { useDroppable, useDragOperation } from "@dnd-kit/react";
import { isNodeDescendant } from "../../storage/fileSystem"
import FolderChildren from "./FolderChildren"
import RenameNode from "./RenameNode";

export default function Folder({folderId, tree, node, index, 
                                depth, renameIcon, deleteIcon}) {
    const isEmpty = tree[node.id].length === 0;
    const [isDragging, setIsDragging] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const {ref: sortable} = useSortable({
        id: node.id,
        index: index,
        group: folderId,
        collisionPriority: depth,
        disabled: isDragging,
        type: "folder",
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree)
        }
    })

    const {ref: droppable} = useDroppable({
        id: node.id + "|droppable",
        type: "folder",
        collisionPriority: depth + 1,
        disabled: !isFolderDroppable(isEmpty),
    })

    function handleRenameToggle(e) {
        setIsRenaming(!isRenaming)
    }

    function handleFolderToggle() {
        setIsOpen(!isOpen)
    }

    function handleIsDragging() {
        const {source} = useDragOperation();
        setIsDragging(source.id === node.id);
    }
    
    function mergeRefs(...refs) {
        return (node) => {
            refs.forEach((ref) => ref(node))
        }
    }

    function isFolderDroppable(isEmpty) {
        if(isEmpty) return true
        return false
    }
    
    return (
        <li className="folder" 
            key={node.id}  
            data-id={node.id} 
            ref={mergeRefs(sortable, droppable)}
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
                                       isFolderDroppable={isFolderDroppable}/>} 
        </li>
    )
}
