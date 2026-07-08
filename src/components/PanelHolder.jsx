import { useState, useEffect } from "react";
import { nodeMap } from "../storage/fileSystem.js";
import AssistantPanel from "./AssistantPanel/AssistantPanel.jsx"
import EditorPanel from "./EditorPanel/EditorPanel.jsx"
import FileTreePanel from "./FileTreePanel/FileTreePanel.jsx"

export default function PanelHolder() {

    /**
     * The current document object in Tiptap JSON format from editor.
     */
    const [editorDoc, setEditorDoc] = useState();

    /**
     * The selected document object in Tiptap JSON format from nodeMap.
     */
    const [selectedDoc, setSelectedDoc] = useState();

    /**
     * Text selection event from editor.
     */
    const [selection, setSelection] = useState(null);

    /**
     * The current document node's unique identifier in nodeMap.
     */
    const [docNodeId, setDocNodeId] = useState();

    /**
     * The current document name.
     */
    const [docName, setDocName] = useState();
    
    /**
     * Update nodeMap on editor text update using editorDoc.
     */
    useEffect(() => {
        if(!editorDoc) return;
        nodeMap[docNodeId].tiptapContent = editorDoc
    },[editorDoc])

    /**
     * Saves selected document's id to local storage
     * get last active document on editor mount. 
     */
    useEffect(() => {
        if(docNodeId) {
            localStorage.setItem("prevDocId", docNodeId);
        }
        
    }, [docNodeId])

    /**
     * Set current document name. 
     */
    useEffect(() => {
        setDocName(nodeMap[docNodeId]?.name);
    }, [docNodeId])

    /**
     * Set docname if previous doc id exists on mount
     */
    useEffect(() => {
        const prevDocId = localStorage.getItem("prevDocId");

        if(prevDocId) setDocName(nodeMap[prevDocId]?.name);        
    }, [])

    /**
     * Event handler when selecting a document from file panel. Updates selected 
     * doc using passed id for nodeMap lookup and updates nodeId.
     * 
     * @param {*} id is the user selected document node's Id. 
     */
    function handleSelectedDoc(id) {
        const nodeDoc = nodeMap[id].tiptapContent;

        setSelectedDoc(s => nodeDoc);
        setDocNodeId(id);
    }

    /**
     * Updates editorDoc by tracking document changes on editor component.
     * @param {*} currentDoc 
     */
    function handleEditorTxtUpdate(currentDoc) {
        setEditorDoc(currentDoc);
    }

    /**
     * Updates editor title when document is renamed on file tree.
     * @param {*} id of node that is renamed.
     */
    function handleDocumentRename(id) {
        if(docNodeId === id) {
            setDocName(nodeMap[id].name)
        }
    }

    /**
     * Updates selection state when use selects a text on editor.
     * 
     * @param {*} selection the selection object from Tiptap editor.
     */
    function handleSelection(selection) {
        setSelection(selection)
    }

    return (
        <div className="panelHolder">
            <FileTreePanel handleSelectedDoc={handleSelectedDoc}
                           handleDocumentRename={handleDocumentRename}/>

            <EditorPanel selectedDoc={selectedDoc}
                         docName={docName}
                         handleEditorTxtUpdate={handleEditorTxtUpdate}
                         handleSelection={handleSelection}/>
                         
            <AssistantPanel selection={selection}/>
        </div>
    )
}

