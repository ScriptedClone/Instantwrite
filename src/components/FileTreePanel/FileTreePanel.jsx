// Is this using the concept of tree-traversal and recursive components?
import { useState , useEffect} from "react";
import { tree, updateTree } from "../../storage/fileSystem"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";

export default function FileTreePanel({ docMap, handleSelectedDoc }) {
    /**
     * Stores object reference of tree from fileSystem module.
     */
    const [fileTree, setFileTree] = useState(tree);
    
    /**
     * Creates a new tree and overwrites old tree with
     * new text document.
     */
    function handleSetFileTree() {
        setFileTree(f => updateTree())
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleSetFileTree={handleSetFileTree}/>
            <FileTree docMap={docMap}  fileTree={fileTree} handleSelectedDoc={handleSelectedDoc}/>
        </div>
    
    )
}
