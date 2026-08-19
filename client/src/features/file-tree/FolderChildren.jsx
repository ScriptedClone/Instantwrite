import { useContext } from "react"
import { ProjectContext } from "../work-space/context/ProjectContext.js"
import renameIcon from "../../assets/googleRenameIcon.png"
import deleteIcon from "../../assets/googleDeleteIcon.png"
import Folder from "./Folder.jsx"
import Document from "./Document.jsx"


/**
 * This component is part of a two-step recursion that builds the nested list. The
 * second recursion is triggered when a folder is toggled to expand.
 * 
 * @param {*} folderId is the current folder level. 
 * @param {*} depth is used by Folder/Document components to determine collision 
 * priority during drag and drop operations.
 * @returns 
 */
export default function FolderChildren({folderId, depth}) {
    const { projectState } = useContext(ProjectContext);
    const { folderChildMap, nodeMapRef } = projectState;

    return (
        <ul>
            {folderChildMap && folderChildMap[folderId].map((childId, index) => {
                if(nodeMapRef.current[childId].type === "folder") {
                    return <Folder key={childId}
                                   folderId={folderId}
                                   node={nodeMapRef.current[childId]}
                                   index={index}
                                   depth={depth}
                                   renameIcon={renameIcon}
                                   deleteIcon={deleteIcon}/>
                }

                if(nodeMapRef.current[childId].type === "document") {
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
