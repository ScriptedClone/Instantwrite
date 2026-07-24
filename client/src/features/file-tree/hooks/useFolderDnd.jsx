import { useContext } from "react"
import { ProjectContext } from "../../work-space/context/ProjectContext.js"
import { isNodeDescendant } from "../fileTree.js"
import { useSortable } from "@dnd-kit/react/sortable";
import { useDroppable } from "@dnd-kit/react";

/**
 * This hook is responsible for drag and drop logic between folders 
 * in file tree.
 * 
 * @param {*} props properties of this folder.
 * @returns a callback ref to attach to folder element.
 */
export default function useFolderDnd({node, index, folderId, depth}) {
    const { projectState } = useContext(ProjectContext);
    const { tree, nodeMapRef } = projectState;

    /** evaluates if the folder using this hook is empty or not. */
    const isEmpty = tree[node.id].length === 0;
    
    /** Sortable ref from DND-kit */
    const {ref: sortable} = useSortable({
        id: node.id,
        index: index,
        group: folderId,
        collisionPriority: depth,
        type: "folder",
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(source.id, node.id, tree, nodeMapRef.current)
        }
    })

    /**
     * Droppable ref from DND-kit. This ref is disabled when
     * the folder using this hook is not empty. 
     * 
     */
    const {ref: droppable} = useDroppable({
        id: node.id + "|droppable",
        type: "folder",
        collisionPriority: depth + 1,
        disabled: !isEmpty, 
    })
    
    /**
     * Merge multiple callback refs into a single callback ref.
     * 
     * @param  {*} refs callback refs to merge.
     * @returns a callback function that passes the element to each ref. 
     */
    function mergeRefs(...refs) {
        return (element) => {
            refs.forEach((ref) => ref(element))
        }
    }

    return { ref: mergeRefs(sortable, droppable) };
}
