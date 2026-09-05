import { extensions } from "./config/extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect, useRef } from "react";
import EditorTitle from "./EditorTitle.jsx";
import './EditorPanel.css'

export default function EditorPanel({handleEditorTxtUpdate, handleSelection, selectedDoc, docName}) {
    
    const editorPanelRef = useRef(null);
    const editor = useEditor({
        extensions: extensions,
        content: "",
        autofocus: true,
    })

    /** Set editor to selected document in file tree */
    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])
    
    /** 
     * Gets editor and converts to JSON for every
     * editor text update.
     */
    useEffect(() => {
        function handleEditorUpdate() {
            handleEditorTxtUpdate(editor.getJSON());
        }

        editor.on('update', handleEditorUpdate);

        return () => editor.off('update', handleEditorUpdate)
    }, [])

    /** 
     * Pass generated selection object to handler
     */
    useEffect(() => {
        function handleSelectionUpdate() {
            if (editor.state.selection.empty) return
            const selection = editor.state.selection

            handleSelection(selection);
        }

        editor.on('selectionUpdate', handleSelectionUpdate);

        return () => editor.off('selectionUpdate', handleSelectionUpdate);
    }, [])

    /**
     * Enable editor panel empty space to be clickable and move
     * user cursor at the end of the editor document.
     * 
     * @param {*} e 
     */
    function handleClickCapture(e) {
        if(e.target === editorPanelRef.current) {
            editor.commands.focus('end')
        } 
    }

    return (
        <div className="editorPanel" onClick={handleClickCapture} ref={editorPanelRef}>
            <EditorTitle docName={docName}/>
            <EditorContent className ="editor" editor={editor}/>
        </div>
    )

}
