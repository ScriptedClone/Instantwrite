import { useDragOperation } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { isNodeDescendant } from "../fileTree";
import { ROOT_FOLDER_DEPTH } from "../const/depth.js";

/**
 * This enables file-tree as a root level folder when a
 * file is being dragged.
 * 
 * @returns useSortable hook from DND-kit
 */
export function useRootDnd({rootIdRef, nodeMapRef, folderChildMap}) {
    const { source } = useDragOperation();

    const { ref } = useSortable({
        id: rootIdRef.current,
        index: folderChildMap[rootIdRef.current].length,
        group: rootIdRef.current,
        type: "folder",
        collisionPriority: ROOT_FOLDER_DEPTH,
        disabled: (!(source)),
        accept: (source) => {
            if(source.type !== "folder") return true;

            return !isNodeDescendant(
                source.id, 
                rootIdRef.current, 
                folderChildMap, 
                nodeMapRef.current)
        }
    })

    return { ref };
}
