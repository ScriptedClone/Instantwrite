// Is this using the concept of tree-traversal and recursive components?
import { useRef } from "react";
import FileTree from "./FileTree";

export default function FileTreePanel({ fileTree, docMap, handleSelectedDoc }) {
    return (
        <>
            <div className="fileTreePanel">
                <FileTree docMap={docMap} fileTree={fileTree} handleSelectedDoc={handleSelectedDoc}/>
            </div>
        </>

    )
}
