import { useState, useEffect, useRef } from "react";
import { getProject } from "../services/projectAPI";
import { addDocumentNode, addFolderNode, moveNode, renameNode, deleteNode, getFolderRoot } from "../../file-tree/fileTree";

export default function useProject(projectId) {
    /** Stores the file-tree hierarchy and triggers UI updates when it changes. */
    const [folderChildMap, setfolderChildMap] = useState(null);

    /** This is a hashmap that contains node id as key and the node itself as value. */ 
    const nodeMapRef = useRef(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProject() {
            setError(null);

            try {
                const { folderChildMap, nodeMap: ref} = await getProject(projectId);
                nodeMapRef.current = ref
                setfolderChildMap(folderChildMap) 
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
        if(!folderChildMap[currentFolder]) {
            currentFolder = getFolderRoot(nodeMapRef.current);
        }

        setfolderChildMap(addDocumentNode(currentFolder, folderChildMap, nodeMapRef.current));
    }

    function addFolder(currentFolder) {
        if(!folderChildMap[currentFolder]) {
            currentFolder = getFolderRoot(nodeMapRef.current);
        }

        setfolderChildMap(addFolderNode(currentFolder, folderChildMap, nodeMapRef.current));
    }

    function renameFile(name, nodeId) {
        setfolderChildMap(renameNode(name, nodeId, folderChildMap, nodeMapRef.current));
    }

    function deleteFile(nodeId){
        setfolderChildMap(deleteNode(nodeId, folderChildMap, nodeMapRef.current));
    }

    function moveFile(initialIndex, initialGroup, index, group, id) {
        setfolderChildMap(moveNode(initialIndex, initialGroup, index, group, id, folderChildMap));
    }

    function restorefolderChildMap(previousfolderChildMap) {
        setfolderChildMap(previousfolderChildMap);
    }

    return {
        state:{ folderChildMap, nodeMapRef, loading, error },
        actions: { 
            updateNodeContent, 
            addDocument, 
            addFolder, 
            renameFile, 
            deleteFile,
            moveFile, 
            restorefolderChildMap
        }
    }
}
