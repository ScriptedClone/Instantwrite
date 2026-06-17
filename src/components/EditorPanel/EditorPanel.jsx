import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";
import './EditorPanel.css'

export default function EditorPanel({onEditorTxtUpdate, getSelectedTxt, selectedDoc}) {
    const editor = useEditor({
        extensions: extensions,
        content: "",
    })

    // Uses selected document from file tree to update editor.
    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])
    
    // Track editor text and update editorDoc 
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

    return <EditorContent className="editorPanel" editor={editor}/>
}
