import { useState, useRef, useEffect, use} from "react";
import { tree, documentMap } from "../storage/fileSystem.js";
import AssistantPanel from "./AssistantPanel/AssistantPanel.jsx"
import EditorPanel from "./EditorPanel/EditorPanel.jsx"
import FileTreePanel from "./FileTreePanel/FileTreePanel.jsx"

export default function Panels() {

    /**
     * Stores the current document object in Tiptap JSON format from editor
     */
    const [editorDoc, setEditorDoc] = useState(); // remember to change to editorDoc / setEditorDoc

    /**
     * Stores the selected document object in Tiptap JSON format from hashmap/docMap
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
     * Holds the current file tree from local storage in memory.
     * 
     * USAGE: Building file tree panel list.
     */
    const [fileTree, setFileTree] = useState(tree.content);

    /**
     * Stores a hashmap reference for document node from tree using their
     * document name as key.
     * 
     */
    const docMap = useRef(documentMap)
    
    // For Debugging
    useEffect(() => {
        if(!editorDoc) return
        //console.log("current selected doc")
        //console.log(selectedDoc);
        //console.log(docMap)
        //console.log("The editor doc")
        //console.log(editorDoc)
    }, [editorDoc])

    /**
     * Updates docMap hashmap in real-time by using
     * editor doc to update selector doc
     */
    useEffect(() => {
        if(!editorDoc) return;
        docMap.current[docName].tiptapContent = editorDoc

    },[editorDoc])

    /**
     * Event handler for the file tree panel when selecting a document from 
     * file panel. Updates selected doc by getting object from hashmap. Updates
     * docName. 
     * 
     * @param {*} e is an event object from the selected <li>. 
     */
    function handleSelectedDoc(e) { 
        // Gets the document object from hashmap using key from selected text content
        const nodeDoc = docMap.current[e.target.textContent].tiptapContent;

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
            <FileTreePanel fileTree={fileTree}
                           handleSelectedDoc={handleSelectedDoc}/>

            <EditorPanel selectedDoc={selectedDoc}
                         onEditorTxtUpdate={onEditorTxtUpdate}
                         getSelectedTxt={getSelectedTxt}/>
                         
            <AssistantPanel editorSelectedTxt={editorSelectedTxt}/>
        </div>
    )
}

