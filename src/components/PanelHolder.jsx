import { useState, useRef, useEffect, use} from "react";
import { tree, treeNodeMap } from "../storage/fileSystem.js";
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
     * This variable stores selected text as a string from the 
     * editor.
     */
    const [editorSelectedTxt, setEditorSelectedTxt] = useState();

    /**
     * Stores current document's name.
     */
    const [docName, setDocName] = useState();

    /**
     * A hashmap for node reference from file tree in memory. Node name
     * name is used as key.
     */
    const nodeMap = useRef(treeNodeMap)
    
    // For Debugging
    useEffect(() => {
        if(!nodeMap) return
    }, [nodeMap])

    /**
     * Updates docMap hashmap in real-time by using editorDoc.
     */
    useEffect(() => {
        if(!editorDoc) return;
        nodeMap.current[docName].tiptapContent = editorDoc

    },[editorDoc])

    /**
     * Event handler when selecting a document from file panel. Updates selected 
     * doc by getting object from hashmap. Updates docName. 
     * 
     * @param {*} e is an event object from the selected <li>. 
     */
    function handleSelectedDoc(e) { 
        console.log(nodeMap.current);
        // Gets the document object from hashmap using key from selected text content
        const nodeDoc = nodeMap.current[e.target.textContent].tiptapContent;

        setSelectedDoc(s => nodeDoc);
        setDocName(e.target.textContent);
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

