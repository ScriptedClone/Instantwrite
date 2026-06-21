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
     * Stores the selected document object in Tiptap JSON format from hashmap/docMap.
     */
    const [selectedDoc, setSelectedDoc] = useState();

    /**
     * Stores selected text as a string from the editor.
     */
    const [editorSelectedTxt, setEditorSelectedTxt] = useState();

    /**
     * Stores current document node's unique identifier.
     */
    const [docNodeId, setDocNodeId] = useState();
    
    // For Debugging
    useEffect(() => {
        if(!nodeMap) return
        //console.log(nodeMap);
    }, [nodeMap])

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

        // Updates selected doc.
        setSelectedDoc(s => nodeDoc);
        setDocNodeId(id);
    }

    /**
     * Updates editorDoc by tracking document changes on editor component.
     *  
     * @param {*} currentContext 
     */
    function onEditorTxtUpdate(currentDoc) {
        setEditorDoc(currentDoc);
    }

    /**
     * Updates editorSelectedTxt by a string returned from user selected
     * text on editor component. 
     * 
     * @param {*} selectedTxt 
     */
    function getSelectedTxt(selectedTxt) {
        setEditorSelectedTxt(selectedTxt);
    }

    return (
        <div className="panelHolder">
            <FileTreePanel handleSelectedDoc={handleSelectedDoc}/>

            <EditorPanel selectedDoc={selectedDoc}
                         onEditorTxtUpdate={onEditorTxtUpdate}
                         getSelectedTxt={getSelectedTxt}/>
                         
            <AssistantPanel editorSelectedTxt={editorSelectedTxt}/>
        </div>
    )
}

