import { useState, 
         useRef,
         useEffect,
         createContext} from "react";
import { nodeMap,
         syncFileTreeToDisk, 
         addDocumentNode, 
         addFolderNode, 
         deleteNode,
         renameNode} from "../../storage/fileSystem"
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers"
import FileTree from "./FileTree";
import FileTreeHeader from "./FileTreeHeader";
import './FileTreePanel.css'

export default function FileTreePanel({ handleSelectedDoc, handleDocumentRename }) {
    /** Track structural changes to folder tree in memory*/
    const [tree, setTree] = useState(()=> {
        const localTree = JSON.parse(localStorage.getItem("tree"));
        return localTree;
    });

    /** Store previous tree on drag start. */
    const previousTree = useRef(tree);

    /** Stores user selected folder node id. */
    const [folderNodeId, setFolderNodeId] = useState(0);

    /**
     * Sets selected folder ID by user.
     * @param {*} id is the id of currently selected folder.
     */
    function handleSelectedFolder(id) {
        setFolderNodeId(id)
    }

    /**
     * Event router for header component.
     * @param {} button is the button type the user selects. 
     * @returns 
     */
    function handleHeaderBtn(button) {
        if(button === "document") {
            console.log("Create document");
            setTree(addDocumentNode(folderNodeId, tree));
        }

        if(button === "folder") {
            console.log("Create folder")
            setTree(addFolderNode(folderNodeId, tree));
        }

        if(button === "save") {
            console.log("Synced files");
            syncFileTreeToDisk(tree);
        }
    }
    
    /**
     * Event router within file tree component.
     * @param {*} e 
     */
    function handleTree(e) {
        if(!e.target.dataset.id) return;
        const id = e.target.dataset.id;
        console.log("event delegated");
        if(id.includes("|")) {
            const btnKey = id.split("|");
            const nodeId = btnKey[0];
            const btnType = btnKey[1];

            if(btnType === "deleteBtn") {
                setTree(deleteNode(nodeId, tree));
            }

            if(btnType === "renameBtn") {
                const newName = e.target.value
                setTree(renameNode(newName, nodeId, tree))

                if(nodeMap[nodeId].type !== "folder") handleDocumentRename(nodeId);
            }
        }

        if(nodeMap[id]?.type === 'text') {
            handleSelectedDoc(id);
            return;
        }
        
        if(nodeMap[id]?.type === 'folder') {
            handleSelectedFolder(id);
            return;
        }
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleHeaderBtn={handleHeaderBtn}/>
            <DragDropProvider
                onDragStart={() => {
                    previousTree.current = tree;
                }}

                onDragOver={(e) => {
                    const {source, target} = e.operation;
                    setTree((items) => move(items, e))
                }}

                onDragEnd={(e)=> {
                    const {source, target} = e.operation;

                    if(e.canceled) {
                        setTree(previousTree.current);
                        return;
                    }
                }}
            >
                <FileTree tree={tree} 
                          handleTree={handleTree}/>
            </DragDropProvider>

        </div>
    
    )
}

