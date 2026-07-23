import { extensions } from "./services/extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import EditorTitle from "./EditorTitle.jsx";
import Editor from "./Editor.jsx";
import './EditorPanel.css'

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
