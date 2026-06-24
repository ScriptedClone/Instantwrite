import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";
import './EditorPanel.css'
import { nodeMap } from "../../storage/fileSystem.js";
import EditorTitle from "./EditorTitle.jsx";
import Editor from "./Editor.jsx";

export default function EditorPanel({onEditorTxtUpdate, 
                                     getSelectionEvent, 
                                     selectedDoc, 
                                     handleSelectedDoc, 
                                     docName}) {

    return (
        <div className="editorPanel">
            <EditorTitle docName={docName}/>
            <Editor onEditorTxtUpdate={onEditorTxtUpdate}
                    getSelectionEvent={getSelectionEvent}
                    selectedDoc={selectedDoc}
                    handleSelectedDoc={handleSelectedDoc}/>
        </div>
    )

}
