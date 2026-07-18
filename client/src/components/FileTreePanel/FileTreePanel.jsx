import { useState, useRef } from "react";
import { isSortable } from "@dnd-kit/react/sortable";
import { nodeMap,
         moveNode,
         addDocumentNode, 
         addFolderNode, 
         deleteNode,
         renameNode} from "../../data/fileTree.js"
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers"
import FileTree from "./FileTree.jsx";
import FileTreeHeader from "./FileTreeHeader.jsx";
import { TreeActionsContext } from "./TreeActionsContext.js";
import { useTree } from "./hooks/useTree.jsx";
import './FileTreePanel.css'

const ROOT_FOLDER_ID = 0;

export default function FileTreePanel({ handleSelectedDoc, handleDocumentRename }) {

    /**  Store tree from database and react on structural changes. */
    const { tree, setTree } = useTree("dev1")

    /** Store previous tree on drag start. */
    const previousTree = useRef(null);

    /** Stores user selected folder node id. */
    const [folderNodeId, setFolderNodeId] = useState(ROOT_FOLDER_ID);

    /**
     * handles header button clicks which adds a folder or document or save the 
     * current file tree to local storage.
     * 
     * @param {} button "document", "folder", "save"
     * @returns 
     */
    async function handleHeaderBtn(button) {
        if(button === "document") {
            setTree(addDocumentNode(folderNodeId, tree));
        }

        if(button === "folder") {
            setTree(addFolderNode(folderNodeId, tree));
        }

        if(button === "save") {
            //await putProject('dev1', tree, nodeMap );
        }
    }

    /**
     * Renames a node on tree and passes the id of node that was renamed
     * to handler to check if the current document on the editor is the node
     * that is renamed.
     * 
     * @param {*} name the name to be set.
     * @param {*} nodeId id of node to be renamed.
     */
    function handleRename(name, nodeId) {
        setTree(renameNode(name, nodeId, tree));

        if(nodeMap[nodeId].type !== "folder") handleDocumentRename(nodeId);
    }
    function handleDelete(nodeId){
        setTree(deleteNode(nodeId, tree));
    }
    const actions = {
        onRename: handleRename,
        onDelete: handleDelete,
        onSelectDoc: handleSelectedDoc,
        onSelectFolder: setFolderNodeId,
    }
    
    /**
     * Updates tree in memory on drag end.,
     * 
     * @param {*} e 
     * @returns 
     */
    function handleOnDragEnd(e) {
        const { source, target } = e.operation;
        if(e.canceled || !target) {
            setTree(previousTree.current);
            return;
        }
        if(isSortable(target)) {
            const {initialIndex, initialGroup, id} = source;
            const {index, group} = target;
            
            setTree(moveNode(initialIndex, initialGroup, index, group, tree, id))
            return;
        }

        const {initialIndex, initialGroup, id} = source;
        const {id: key} = target;
        const group = key.slice(0, key.indexOf("|"))
        if(source.id === group) {
            setTree(previousTree.current);
            return;
        }

        setTree(moveNode(initialIndex, initialGroup, 0, group, tree, id))
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleHeaderBtn={handleHeaderBtn}/>
            <DragDropProvider
                onDragStart={() => {
                    previousTree.current = tree;
                }}

                onDragOver={(e) => {
                    e.preventDefault()
                }}

                onDragEnd={handleOnDragEnd}
            >
                <TreeActionsContext.Provider value={actions}>
                    <FileTree tree={tree}/>
                </TreeActionsContext.Provider>
            </DragDropProvider>
        </div>
    )
}
