// Is this using the concept of tree-traversal and recursive components?
import { useState , useEffect} from "react";
import { treeNodeMap, tree, addDocumentNode, addFolderNode, deleteNode } from "../../storage/fileSystem"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";
import './FileTreePanel.css'

export default function FileTreePanel({ handleSelectedDoc }) {
    /**
     * Stores object reference of tree from fileSystem module. It
     * is used to track file tree structural updates.
     */
    const [fileTree, setFileTree] = useState(tree);

    /**
     * Stores user selected folder node id.
     */
    const [folderNodeId, selectedFolderNodeId] = useState(0);
    
    /**
     * Sets selected folder ID by user.
     * @param {*} e 
     */
    function handleSelectedFolder(id) {
        selectedFolderNodeId(id)
    }

    /**
     * Event router for creating document or folder nodes within
     * selected folder.
     */
    function handleSetFileTree(nodeType) {

        if(nodeType === "document") {
            setFileTree(f => addDocumentNode(folderNodeId));
        }
        
        if(nodeType === "folder") {
            setFileTree(f => addFolderNode(folderNodeId))
        }
    }

    
    /**
     * Event router for events within file tree component.
     * @param {*} e 
     */
    function handleFileTree(e) {

        const id = e.target.dataset.id;
        
        if(e.target.tagName === "BUTTON") {
            const btnKey = e.target.dataset.id.split('|');
            const nodeId = btnKey[0];
            const btnType = btnKey[1]

            if(btnType === "deleteBtn") {
                setFileTree(f => deleteNode(nodeId, btnType))
            }
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
