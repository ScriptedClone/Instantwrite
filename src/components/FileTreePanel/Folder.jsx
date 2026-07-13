import { useState, useContext } from "react"
import { useSortable } from "@dnd-kit/react/sortable";
import { useDroppable } from "@dnd-kit/react";
import { isNodeDescendant } from "../../storage/fileSystem"
import { TreeActionsContext } from "./TreeActionsContext";
import FolderChildren from "./FolderChildren"
import RenameNode from "./RenameNode";


export default function Folder({folderId, tree, node, index, 
                                depth, renameIcon, deleteIcon}) {
    
    const { onDelete, onSelectFolder } = useContext(TreeActionsContext)
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const isEmpty = tree[node.id].length === 0;

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
        id: node.id + "|droppable",
        type: "folder",
        collisionPriority: depth + 1,
        disabled: !isEmpty, 
    })

    function handleRenameToggle(e) {
        setIsRenaming(!isRenaming)
    }

    function handleFolderToggle() {
        setIsOpen(!isOpen)
    }
    
    function mergeRefs(...refs) {
        return (node) => {
            refs.forEach((ref) => ref(node))
        }
    }
    
    return (
        <li className="folder" 
            key={node.id}
            ref={mergeRefs(sortable, droppable)}
            onClick={() => onSelectFolder(node.id)}
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
