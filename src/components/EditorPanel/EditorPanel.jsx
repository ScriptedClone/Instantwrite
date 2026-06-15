import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";
import './EditorPanel.css'

export default function EditorPanel({getEditorTxt, getSelectedTxt, selectedDoc}) {
    const editor = useEditor({
        extensions: extensions,
        content: "",
    })

    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])
    
    useEffect(() => {
        editor.on('update', () => {
            getEditorTxt(editor.getJSON());
        })
    }, [])

    useEffect(() => {
        editor.on('selectionUpdate', () => {
            if (editor.state.selection.empty) return
            const { from, to } = editor.state.selection;

            getSelectedTxt(editor.state.doc.textBetween(from, to, ' '));
        })
    }, [])

    return <EditorContent className="editorPanel" editor={editor}/>
}
