import { useState } from "react"

export default function useDocument() {
    /**
     * The selected document object in Tiptap JSON format from nodeMap.
     */
    const [selectedDoc, setSelectedDoc] = useState(null);

    /**
     * The current document node's unique identifier in nodeMap.
     */
    const [docNodeId, setDocNodeId] = useState(null);

    /**
     * The current document name.
     */
    const [docName, setDocName] = useState(null);

    /**
     * Sets the current document to the corresponding node from
     * nodemap using id.
     * 
     * @param {*} id is the user selected document node's Id. 
     * @param {*} nodeMapRef 
     */
    function setDoc(id, nodeMapRef) {
        setDocNodeId(nodeMapRef.current[id]?.id)
        setDocName(nodeMapRef.current[id]?.name)
        setSelectedDoc(nodeMapRef.current[id]?.tiptapContent)
    }

    /**
     * This is used to sync document name on editor when
     * it is renamed on file tree panel.
     * 
     * @param {*} id id of node that is renamed.
     */
    function renameDoc(id, nodeMapRef) {
        setDocName(nodeMapRef.current[id].name)
    }

    return {
        state: {selectedDoc, docNodeId, docName},
        actions: {setDoc, renameDoc}
    }
    
}
