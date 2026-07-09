import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";

export default function Editor({handleEditorTxtUpdate, handleSelection, selectedDoc}) {
    const editor = useEditor({
        extensions: extensions,
        content: "",
    })

    /** Set editor to selected document in file tree */
    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])

    /** Get last active document on mount. */
    useEffect(() => {
        if(editor.isEmpty) {
            const prevDocId = localStorage.getItem("prevDocId");
            const nodeMap = JSON.parse(localStorage.getItem("nodeMap"));
            const doc = nodeMap[prevDocId]?.tiptapContent;

            editor.commands.setContent(doc);
        }
    }, [])
    
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

    return <EditorContent className ="editor" editor={editor}/>
}
