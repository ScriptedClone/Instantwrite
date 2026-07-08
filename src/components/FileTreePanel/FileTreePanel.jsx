import { useState, useRef } from "react";
import { nodeMap,
         moveNode,
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
import { isSortable } from "@dnd-kit/react/sortable";

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
            setTree(addDocumentNode(folderNodeId, tree));
        }

        if(button === "folder") {
            setTree(addFolderNode(folderNodeId, tree));
        }

        if(button === "save") {
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
    
    function isFolderDroppable(isEmpty) {
        if(isEmpty) return true
        return false
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleHeaderBtn={handleHeaderBtn}/>
            <DragDropProvider
                onDragStart={(e) => {
                    previousTree.current = tree;
                }}

                onDragOver={(e) => {
                    e.preventDefault()
                }}

                onDragEnd={(e)=> {
                    if(e.canceled) {
                        setTree(previousTree.current);
                        return;
                    }

                    const { source, target } = e.operation;
                    
                    if (!target) return;
                    if(isSortable(target)) {
                        const {initialIndex, initialGroup, id} = source;
                        const {index, group} = target;

                        setTree(moveNode(initialIndex, initialGroup, index, group, tree, id))
                        return;
                    }

                    const {initialIndex, initialGroup, id} = source;
                    const {id: key} = target;
                    const group = key.split("|");

                    setTree(moveNode(initialIndex, initialGroup, null, group[0], tree, id))
                }}
            >
                <FileTree tree={tree} 
                          handleTree={handleTree}
                          isFolderDroppable={isFolderDroppable}/>
            </DragDropProvider>

        </div>
    
    )
}
