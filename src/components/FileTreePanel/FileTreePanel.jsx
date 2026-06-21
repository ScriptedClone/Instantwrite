import { useState , useEffect} from "react";
import { folderTree, nodeMap, addDocumentNode, addFolderNode, deleteNode } from "../../storage/fileSystem"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";
import './FileTreePanel.css'

export default function FileTreePanel({ handleSelectedDoc }) {

    /**
     * Track structural changes to folder tree.
     */
    const [tree, setTree] = useState(folderTree);

    /**
     * Stores user selected folder node id.
     */
    const [folderNodeId, setFolderNodeId] = useState(0);

    /**
     * Sets selected folder ID by user.
     * @param {*} e 
     */
    function handleSelectedFolder(id) {
        setFolderNodeId(id)
    }

    /**
     * Event router for header component
     * @param {} button 
     * @returns 
     */
    function handleHeaderBtn(button) {
        if(button === "document") {
            console.log("Create document");
            setTree(addDocumentNode(folderNodeId))
        }

        if(button === "folder") {
            console.log("Create folder")
            setTree(addFolderNode(folderNodeId));
        }
    }
    
    /**
     * Event router within file tree component.
     * @param {*} e 
     */
    function handleTree(e) {
        //console.log("event from file tree")
        const id = e.target.dataset.id;

        if(id.includes("|")) {
            const btnKey = id.split("|");
            const nodeId = btnKey[0];
            const btnType = btnKey[1];

            if(btnType === "deleteBtn") {
                //console.log("Selected delete button")
                setTree(deleteNode(nodeId));
            }
        }

        if(nodeMap[id]?.type === 'text') {
            //console.log("selected text id: " + id)
            handleSelectedDoc(id);
            return;
        }
        if(nodeMap[id]?.type === 'folder') {
            //console.log("selected folder id: " + id);
            handleSelectedFolder(id);
            return;
        }
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleHeaderBtn={handleHeaderBtn}/>
            <FileTree folderTree={folderTree} 
                      handleTree={handleTree}/>
        </div>
    
    )
}
