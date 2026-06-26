import { useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../../storage/fileSystem"
import FolderChildren from "./FolderChildren"
import RenameNode from "./RenameNode";

export default function Folder({folderId, tree, node, index, 
                                depth, renameIcon, deleteIcon}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const {ref} = useSortable({
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

    function handleRenameToggle(e) {
        setIsRenaming(!isRenaming)
    }

    function handleFolderToggle() {
        setIsOpen(!isOpen)
    }
    
    return (
        <li className="folder" 
            key={node.id}  
            data-id={node.id} 
            ref={ref}
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
                                       depth={depth + 1}/>} 
        </li>
    )
}
