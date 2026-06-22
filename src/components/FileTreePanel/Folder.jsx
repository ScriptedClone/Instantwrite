import { useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../../storage/fileSystem"
import FolderChildren from "./FolderChildren"

export default function Folder({folderId, tree, node, index, depth}) {
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

    const [isOpen, setIsOpen] = useState(false);

    function handleFolderToggle() {
        console.log("toggle")
        setIsOpen(!isOpen)
    }
    
    return (
        <li className="folder" key={node.id}  data-id={node.id} ref={ref}>
            <span onClick={(e) => {
                e.stopPropagation() // Stop filetree component catching folderToggle event.
                handleFolderToggle()
            }}>
                {">"}
            </span>

            {node.name}

            <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                X
            </button>

            {isOpen && <FolderChildren folderId={node.id}
                                       tree={tree}
                                       depth={depth + 1}/>} 
        </li>
    )
}
