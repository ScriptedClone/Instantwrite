import { useState, useRef, useEffect, use} from "react";
import { tree, documentMap, saveDoc } from "../storage/fileSystem.js";
import AssistantPanel from "./AssistantPanel/AssistantPanel.jsx"
import EditorPanel from "./EditorPanel/EditorPanel.jsx"
import FileTreePanel from "./FileTreePanel/FileTreePanel.jsx"

export default function Panels() {
    const [editorTxt, setEditorTxt] = useState();
    const [editorSelectedTxt, setEditorSelectedTxt] = useState();

    // Selected Doc is the Tiptap Object from docMap
    const [selectedDoc, setSelectedDoc] = useState();

    // Holds name of selectedDoc
    const [docName, setDocName] = useState();

    const [fileTree, setFileTree] = useState(tree.content);

    // Holds reference to a hashmap of Tiptap Document objects
    const docMap = useRef(documentMap)

    useEffect(()=> {
        if(!docName) return;
        console.log("");
        console.log(tree);
        console.log(documentMap)
        console.log(docMap.current)
        saveDoc()
    },[docName])

    useEffect(() => {
        if(!editorTxt) return;
        //docMap.current = {...docMap.current, [docName]: editorTxt}
        docMap.current[docName] = editorTxt
    },[editorTxt])

    function handleSelectedDoc(e) { // remember to decompose
        setSelectedDoc(s => docMap.current[e.target.textContent]);
        setDocName(e.target.textContent);
    }

    // Udpates on every editor change
    function getEditorTxt(currentContext) {
        setEditorTxt(currentContext);
    }

    function getSelectedTxt(selectedContext) {
        setEditorSelectedTxt(selectedContext);
    }

    return (
        <div className="panelHolder">
            <FileTreePanel docMap={docMap}
                           fileTree={fileTree}
                           handleSelectedDoc={handleSelectedDoc}/>

            <EditorPanel selectedDoc={selectedDoc}                
                         getEditorTxt={getEditorTxt}
                         getSelectedTxt={getSelectedTxt}/>
                         
            <AssistantPanel editorSelectedTxt={editorSelectedTxt}/>
        </div>
    )
}

