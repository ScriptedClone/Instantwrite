import { nodeMap } from "../../storage/fileSystem"
import Folder from "./Folder"
import Document from "./Document"

export default function FolderChildren({folderId, folderTree}) {
    return (
        <ul>
            {folderTree[folderId].map((childId) => {
                if(nodeMap[childId].type === "folder") {
                    return <Folder key={childId}
                                   folderTree={folderTree}
                                   node={nodeMap[childId]}/>
                }

                if(nodeMap[childId].type === "text") {
                    return <Document key={childId} 
                                     node={nodeMap[childId]}/>
                }
            })}
        </ul>
    )
}
