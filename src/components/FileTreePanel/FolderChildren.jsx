import { nodeMap } from "../../storage/fileSystem"
import Folder from "./Folder"
import Document from "./Document"

export default function FolderChildren({folderId, tree, depth}) {
    return (
        <ul>
            {tree[folderId].map((childId, index) => {
                if(nodeMap[childId].type === "folder") {
                    return <Folder key={childId}
                                   folderId={folderId}
                                   tree={tree}
                                   node={nodeMap[childId]}
                                   index={index}
                                   depth={depth}/>
                }

                if(nodeMap[childId].type === "text") {
                    return <Document key={childId} 
                                     folderId={folderId}
                                     tree={tree}
                                     node={nodeMap[childId]}
                                     index={index}
                                     depth={depth}/>
                }
            })}
        </ul>
    )
}
