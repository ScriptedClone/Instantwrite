import { useState, useRef, useEffect, use} from "react";
import { nodeMap } from "../storage/fileSystem.js";
import AssistantPanel from "./AssistantPanel/AssistantPanel.jsx"
import EditorPanel from "./EditorPanel/EditorPanel.jsx"
import FileTreePanel from "./FileTreePanel/FileTreePanel.jsx"

export default function Panels() {

    /**
     * Stores the current document object in Tiptap JSON format from editor.
     */
    const [editorDoc, setEditorDoc] = useState();

    /**
     * Stores the selected document object in Tiptap JSON format from nodeMap.
     */
    const [selectedDoc, setSelectedDoc] = useState();

    /**
     * Text selection event from editor.
     */
    const [selection, setSelection] = useState(null);

    /**
     * Stores current document node's unique identifier.
     */
    const [docNodeId, setDocNodeId] = useState();

    /**
     * Stores current document name.
     */
    const [docName, setDocName] = useState();
    
    /**
     * Update nodeMap on editor text update by using editorDoc state
     */
    useEffect(() => {
        if(!editorDoc) return;
        nodeMap[docNodeId].tiptapContent = editorDoc

    },[editorDoc])

    /**
     * Event handler when selecting a document from file panel. Updates selected 
     * doc state by getting document object from hashmap using passed id. Updates docId 
     * to passed id
     * 
     * @param {*} id is the user selected document node's Id. 
     */
    function handleSelectedDoc(id) { 
        const nodeDoc = nodeMap[id].tiptapContent;

        setSelectedDoc(s => nodeDoc);
        setDocNodeId(id);
        setDocName(nodeMap[id].name);
        localStorage.setItem("prevDocId", id);
    }

    /**
     * Updates editorDoc by tracking document changes on editor component.
     * @param {*} currentDoc 
     */
    function onEditorTxtUpdate(currentDoc) {
        setEditorDoc(currentDoc);
    }

    /**
     * Updates editor title when document is renamed on file tree.
     * @param {*} id 
     */
    function onDocumentRename(id) {
        setDocName(nodeMap[id].name)
    }

    /**
     * Updates editorSelectedTxt by a string returned from user selected
     * text on editor component. 
     * 
     * @param {*} selectedTxt 
     */
    function getSelectionEvent(selection) {
        setSelection(selection)
    }

    return (
        <div className="panelHolder">
            <FileTreePanel handleSelectedDoc={handleSelectedDoc}
                           onDocumentRename={onDocumentRename}/>

            <EditorPanel selectedDoc={selectedDoc}
                         docName={docName}
                         handleSelectedDoc={handleSelectedDoc}
                         onEditorTxtUpdate={onEditorTxtUpdate}
                         getSelectionEvent={getSelectionEvent}/>
                         
            <AssistantPanel selection={selection}/>
        </div>
    )
}

