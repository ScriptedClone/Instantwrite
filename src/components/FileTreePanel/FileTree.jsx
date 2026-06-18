import { useState } from "react";
import { tree } from "../../storage/fileSystem"
import Folder from "./Folder"

export default function FileTree({fileTree, handleFileTree}) {

    return(
        <ul className="FileTreeRoot" data-id={"0"} onClick={handleFileTree}>
            {fileTree && fileTree.content.map((node) => {
                if(node.type === "folder") {
                    return (<Folder key={node.id} node={node}/>)
                }

                if(node.type === "text") {
                    return (
                        <li key={node.id} className="text">
                            <span data-id={node.id}>{node.name}</span>
                            <button data-id={node.id + "|deleteBtn"} key={node.id + "|deleteBtn"}>
                                X
                            </button>
                        </li>
                    )
                }
            })}
        </ul>
    )
}

