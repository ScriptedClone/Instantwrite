// Is this using the concept of tree-traversal and recursive components?
import { useState , useEffect} from "react";
import { tree, updateTree } from "../../storage/fileSystem"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";
import './FileTreePanel.css'

export default function FileTreePanel({ docMap, handleSelectedDoc }) {
    /**
     * Stores object reference of tree from fileSystem module.
     */
    const [fileTree, setFileTree] = useState(tree);
    const [folderID, selectedFolderID] = useState(0);
    
    /**
     * Creates a new tree and overwrites old tree with
     * new text document.
     */
    function handleSetFileTree() {
        
        setFileTree(f => updateTree(folderID));
    }

    /**
     * Sets selected folder ID by user.
     * @param {*} e 
     */
    function handleSelectedFolder(id) {
        //if(!e.target.dataset.id) return;
        //console.log("folder id");
        console.log(id)
        selectedFolderID(id)
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleSetFileTree={handleSetFileTree}/>
            <FileTree docMap={docMap}  
                      fileTree={fileTree} 
                      handleSelectedDoc={handleSelectedDoc}
                      handleSelectedFolder={handleSelectedFolder}/>
        </div>
    
    )
}
