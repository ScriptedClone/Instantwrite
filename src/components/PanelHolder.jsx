import { useState, useRef, useEffect, use} from "react";
import { tree, documentMap } from "../storage/fileSystem.js";
import AssistantPanel from "./AssistantPanel/AssistantPanel.jsx"
import EditorPanel from "./EditorPanel/EditorPanel.jsx"
import FileTreePanel from "./FileTreePanel/FileTreePanel.jsx"

export default function Panels() {
    // For Debugging
    useEffect(() => {
        console.log(selectedDoc);
        //console.log("")
    })

    /**
     * This variable stores the current document object in Tiptap JSON format. 
     */
    const [editorDoc, setEditorDoc] = useState(); // remember to change to editorDoc / setEditorDoc

    /**
     * This variable stores selected text as a string from the 
     * editor.
     */
    const [editorSelectedTxt, setEditorSelectedTxt] = useState();

    /**
     * Stores the current document object in Tiptap JSON format
     */
    const [selectedDoc, setSelectedDoc] = useState();

    /**
     * Stores current document's name.
     */
    const [docName, setDocName] = useState();

    /**
     * Holds the current file tree [reference: not yet] from local storage in memory.
     */
    const [fileTree, setFileTree] = useState(tree.content);

    /**
     * Stores a hashmap reference for document objects using their
     * document name as key.
     */
    const docMap = useRef(documentMap)
    
    /**
     * Updates docMap hashmap in real-time 
     */
    useEffect(() => {
        if(!editorDoc) return;
        docMap.current[docName] = editorDoc

    },[editorDoc])

    /**
     * Event handler for the file tree panel when selecting a 
     * document.
     * 
     * @param {*} e 
     */
    function handleSelectedDoc(e) { 
        // Gets the document object from hashmap using key from selected text content
        setSelectedDoc(s => docMap.current[e.target.textContent]);
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
     * Updates editorSelectedTxt by a string returned from selected
     * text on editor component. 
     * 
     * @param {*} selectedTxt 
     */
    function getSelectedTxt(selectedTxt) {
        setEditorSelectedTxt(selectedTxt);
    }

    return (
        <div className="panelHolder">
            <FileTreePanel docMap={docMap}
                           fileTree={fileTree}
                           handleSelectedDoc={handleSelectedDoc}/>

            <EditorPanel selectedDoc={selectedDoc}                
                         onEditorTxtUpdate={onEditorTxtUpdate}
                         getSelectedTxt={getSelectedTxt}/>
                         
            <AssistantPanel editorSelectedTxt={editorSelectedTxt}/>
        </div>
    )
}

