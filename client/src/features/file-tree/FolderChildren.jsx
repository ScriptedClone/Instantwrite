import { useContext } from "react"
import { ProjectContext } from "../work-space/context/ProjectContext.js"
import renameIcon from "./assets/renameIcon.png"
import deleteIcon from "./assets/deleteIcon.png"
import Folder from "./Folder.jsx"
import Document from "./Document.jsx"


/**
 * This is a recursive component that builds the nested list. The
 * recursion is triggered when a folder is toggled to expand.
 */
export default function FolderChildren({folderId, depth}) {
    const { projectState } = useContext(ProjectContext);
    const { tree, nodeMapRef } = projectState;

    return (
        <ul>
            {tree && tree[folderId].map((childId, index) => {
                if(nodeMapRef.current[childId].type === "folder") {
                    return <Folder key={childId}
                                   folderId={folderId}
                                   node={nodeMapRef.current[childId]}
                                   index={index}
                                   depth={depth}
                                   renameIcon={renameIcon}
                                   deleteIcon={deleteIcon}/>
                }

                if(nodeMapRef.current[childId].type === "text") {
                    return <Document key={childId} 
                                     folderId={folderId}
                                     node={nodeMapRef.current[childId]}
                                     index={index}
                                     depth={depth}
                                     renameIcon={renameIcon}
                                     deleteIcon={deleteIcon}/>
                }
            })}
        </ul>
    )
}
