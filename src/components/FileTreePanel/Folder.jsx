import { useState } from "react"
import FolderChildren from "./FolderChildren"

export default function Folder({node, folderTree}) {
    const [isOpen, setIsOpen] = useState(false);

    function handleFolderToggle() {
        console.log("toggle")
        setIsOpen(!isOpen)
    }
    
    return (
        <li className="folder" key={node.id}  data-id={node.id}>
            <span onClick={(e) => {
                e.stopPropagation() // Stop file tree handler catching this event.
                handleFolderToggle()
            }}>
                {">"}
            </span>

            {node.name}

            <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                X
            </button>

            {isOpen && <FolderChildren folderId={node.id}
                                       folderTree={folderTree}/>} 
        </li>
    )
}
