// Is this using the concept of tree-traversal and recursive components?
import { useState , useEffect} from "react";
import { treeNodeMap, tree, updateTree, deleteTextNode } from "../../storage/fileSystem"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";
import './FileTreePanel.css'

export default function FileTreePanel({ handleSelectedDoc }) {
    /**
     * Stores object reference of tree from fileSystem module.
     */
    const [fileTree, setFileTree] = useState(tree);

    /**
     * Used to determine user selected folder.
     */
    const [folderID, selectedFolderID] = useState(0);
    
    /**
     * Sets selected folder ID by user.
     * @param {*} e 
     */
    function handleSelectedFolder(id) {
        selectedFolderID(id)
    }

    /**
     * Creates a new tree and overwrites old tree with
     * new text document inside selected folder.
     */
    function handleSetFileTree() {
        setFileTree(f => updateTree(folderID));
    }

    
    /**
     * Event router for file tree.
     * @param {*} e 
     */
    function handleFileTree(e) {
        //console.log(e.target.tagName)
        const id = e.target.dataset.id;
        
        //console.log(treeNodeMap[id])
        if(e.target.tagName === "BUTTON") {
            const btnKey = e.target.dataset.id.split('|');
            const nodeId = btnKey[0];
            const btnType = btnKey[1]

            setFileTree(f => deleteTextNode(nodeId, btnType))
        }

        if(treeNodeMap[id]?.type === 'text') {
            console.log(id);
            handleSelectedDoc(id);
        }
        if(treeNodeMap[id]?.type === 'folder') {
            console.log(id);
            handleSelectedFolder(id);
        }
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleSetFileTree={handleSetFileTree}/>
            <FileTree fileTree={fileTree} 
                      handleFileTree={handleFileTree}/>
        </div>
    
    )
}
