import { useContext } from "react"
import { ProjectContext } from "../../workspace/context/ProjectContext.js"
import { isNodeDescendant } from "../fileTree.js"
import { useSortable } from "@dnd-kit/react/sortable";

/**
 * This hook is responsible for drag and drop logic between documents 
 * in file tree.
 * 
 * @param {*} props properties of this document.
 * @returns a callback ref to attach to document element.
 */
export default function useDocumentDnd({node, index, folderId, depth}) {
    const { projectState } = useContext(ProjectContext);
    const { tree, nodeMapRef } = projectState;

    /** Sortable ref from DND-kit */
    const { ref } = useSortable({
        id: node.id,
        index: index,
        group: folderId,
        collisionPriority: depth,
        type: "text",
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree, nodeMapRef.current)
        }
    })

    return { ref };
}
