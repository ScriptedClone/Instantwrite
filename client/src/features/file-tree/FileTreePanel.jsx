import { useState, useRef, useContext } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { TreeActionsContext } from "./context/TreeActionsContext.js";
import { ProjectContext } from "../work-space/context/ProjectContext.js";
import { putProject } from '../work-space/services/projectAPI.js';
import { isSortable } from "@dnd-kit/react/sortable";
import { getFolderRoot } from "./fileTree.js";
import FileTree from "./FileTree.jsx";
import FileTreeHeader from "./FileTreeHeader.jsx";
import './FileTreePanel.css'

export default function FileTreePanel({ handleSelectedDoc, handleDocumentRename }) {
    const { projectState, projectActions, projectId } = useContext(ProjectContext);
    const { tree, nodeMapRef } = projectState;
    const { addDocument, addFolder, renameFile, deleteFile, moveFile, restoreTree} = projectActions

    /** Store previous tree on drag start. */
    const previousTree = useRef(null);

    /** Stores user selected folder node id. */
    const [currentFolder, setCurrentFolder] = useState(getFolderRoot(nodeMapRef.current));

    /**
     * handles header button clicks which adds a folder or document or save the 
     * current file tree to local storage.
     * 
     * @param {} button "document", "folder", "save"
     * @returns 
     */
    async function handleHeaderBtn(button) {
        if(button === "document") addDocument(currentFolder);
        if(button === "folder")  addFolder(currentFolder)
        if(button === "save") await putProject(projectId, tree, nodeMapRef.current)
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
        renameFile(name, nodeId);
        if(nodeMapRef.current[nodeId].type !== "folder") handleDocumentRename(nodeId);
    }
    function handleDelete(nodeId){
        deleteFile(nodeId);
    }
    const actions = {
        onRename: handleRename,
        onDelete: handleDelete,
        onSelectDoc: handleSelectedDoc,
        onSelectFolder: setCurrentFolder,
    }

    function handleFileDragEnd(event) {
        const { source, target } = event.operation;
        if(event.canceled || !target) {
            restoreTree(previousTree.current);
            return;
        }
        if(isSortable(target)) {
            const {initialIndex, initialGroup, id} = source;
            const {index, group} = target;
            
            moveFile(initialIndex, initialGroup, index, group, id)
            return;
        }

        const {initialIndex, initialGroup, id} = source;
        const {id: key} = target;
        const group = key.slice(0, key.indexOf("|"))
        if(source.id === group) {
            restoreTree(previousTree.current);
            return;
        }

        moveFile(initialIndex, initialGroup, 0, group, id)
    }

    return (
        <div className="fileTreePanel">
            <FileTreeHeader handleHeaderBtn={handleHeaderBtn}/>
            <DragDropProvider
                onDragStart={() => {
                    previousTree.current = tree;
                }}

                onDragOver={(event) => {
                    event.preventDefault()
                }}

                onDragEnd={(event) => {
                    handleFileDragEnd(event)
                }}
            >
                <TreeActionsContext.Provider value={actions}>
                    <FileTree />
                </TreeActionsContext.Provider>
            </DragDropProvider>
        </div>
    )
}
