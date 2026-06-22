import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../../storage/fileSystem"

export default function Document({folderId, tree, node, index, depth}) {
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

    return (
        <li key={node.id} className="text" data-id={node.id} ref={ref}>
            
            {node.name}
            
            <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                X
            </button>
        </li>
    )
}
