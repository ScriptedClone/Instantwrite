import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";
import { nodeMap } from "../../storage/fileSystem.js";

export default function Editor({onEditorTxtUpdate, getSelectedTxt, selectedDoc, handleSelectedDoc}) {
    const editor = useEditor({
        extensions: extensions,
        content: "",
    })

    // Uses selected document from file tree to update editor.
    // The created event is from folder/document component.
    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])

    // Displays previously selected document before 
    // Application was closed. 
    useEffect(() => {
        if(editor.isEmpty) {
            const prevDocId = localStorage.getItem("prevDocId");
            const nodeMap = JSON.parse(localStorage.getItem("nodeMap"));
            const doc = nodeMap[prevDocId]?.tiptapContent;

            if(doc) {
                editor.commands.setContent(doc);
                handleSelectedDoc(prevDocId)
            }
        }
    }, [])
    
    // Track editor text and update editorDoc content
    // state in parent component.
    useEffect(() => {
        editor.on('update', () => {
            onEditorTxtUpdate(editor.getJSON());
        })
    }, [])

    // Tracks selected text by user and update
    // editorSelectedTxt
    useEffect(() => {
        editor.on('selectionUpdate', () => {
            if (editor.state.selection.empty) return
            const { from, to } = editor.state.selection;

            getSelectedTxt(editor.state.doc.textBetween(from, to, ' '));
        })
    }, [])

    return <EditorContent className ="editor" editor={editor}/>
}
