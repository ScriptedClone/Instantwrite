import { useState, useEffect, useRef } from "react";
import { getProject } from "../services/projectAPI";
import { addDocumentNode, addFolderNode, moveNode, renameNode, deleteNode } from "../../filetree/fileTree";

export default function useProject(projectId) {
    /**  Store tree from database and react on structural changes. */
    const [tree, setTree] = useState(null);

    /** This is a hashmap that contains node id as key and the node itself as value. */ 
    const nodeMapRef = useRef(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProject() {
            setError(null);

            try {
                const { tree, nodeMap: ref} = await getProject(projectId);
                nodeMapRef.current = ref
                setTree(tree) 
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    },[projectId])

    function updateNodeContent(docNodeId, editorDoc) {
        nodeMapRef.current[docNodeId].tiptapContent = editorDoc;
    }

    function addDocument(currentFolder) {
        setTree(addDocumentNode(currentFolder, tree, nodeMapRef.current));
    }

    function addFolder(currentFolder) {
        setTree(addFolderNode(currentFolder, tree, nodeMapRef.current));
    }

    function renameFile(name, nodeId) {
        setTree(renameNode(name, nodeId, tree, nodeMapRef.current));
    }

    function deleteFile(nodeId){
        setTree(deleteNode(nodeId, tree, nodeMapRef.current));
    }

    function moveFile(initialIndex, initialGroup, index, group, id) {
        setTree(moveNode(initialIndex, initialGroup, index, group, id, tree));
    }

    function restoreTree(previousTree) {
        setTree(previousTree);
    }



    return {
        state:{ tree, nodeMapRef, loading, error },
        actions: { 
            updateNodeContent, 
            addDocument, 
            addFolder, 
            renameFile, 
            deleteFile,
            moveFile, 
            restoreTree
        }
    }
}
