import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { } from "react";
import './EditorPanel.css'
import { nodeMap } from "../../data/fileTree.js";
import EditorTitle from "./EditorTitle.jsx";
import Editor from "./Editor.jsx";

export default function EditorPanel({handleEditorTxtUpdate, 
                                     handleSelection, 
                                     selectedDoc,
                                     docName}) {

    return (
        <div className="editorPanel">
            <EditorTitle docName={docName}/>
            <Editor selectedDoc={selectedDoc}
                    handleEditorTxtUpdate={handleEditorTxtUpdate}
                    handleSelection={handleSelection}/>
        </div>
    )

}
