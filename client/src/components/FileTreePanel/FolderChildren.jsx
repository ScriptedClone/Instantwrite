import { nodeMap } from "../../data/fileTree"
import renameIcon from "../../assets/renameIcon.png"
import deleteIcon from "../../assets/deleteIcon.png"
import Folder from "./Folder"
import Document from "./Document"

/**
 * This is a recursive component that builds the nested list. The
 * recursion is triggered when a folder is toggled to expand.
 */
export default function FolderChildren({folderId, tree, depth}) {
    return (
        <ul>
            {tree && tree[folderId].map((childId, index) => {
                if(nodeMap[childId].type === "folder") {
                    return <Folder key={childId}
                                   folderId={folderId}
                                   tree={tree}
                                   node={nodeMap[childId]}
                                   index={index}
                                   depth={depth}
                                   renameIcon={renameIcon}
                                   deleteIcon={deleteIcon}/>
                }

                if(nodeMap[childId].type === "text") {
                    return <Document key={childId} 
                                     folderId={folderId}
                                     tree={tree}
                                     node={nodeMap[childId]}
                                     index={index}
                                     depth={depth}
                                     renameIcon={renameIcon}
                                     deleteIcon={deleteIcon}/>
                }
            })}
        </ul>
    )
}
