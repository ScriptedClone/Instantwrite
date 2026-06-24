import { extensions } from "./extensions.js"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react";
import { nodeMap } from "../../storage/fileSystem.js";

export default function Editor({onEditorTxtUpdate, getSelectionEvent, selectedDoc, handleSelectedDoc}) {
    const editor = useEditor({
        extensions: extensions,
        content: "",
    })

    /** Set editor to selected document in file tree */
    useEffect(() => {
        if(!selectedDoc || !editor) return;
        editor.commands.setContent(selectedDoc)
    }, [selectedDoc])

    /** Restore last active document on mount. */
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
    
    /** Returns editor text content on update.*/
    useEffect(() => {
        function handleEditorUpdate() {
            onEditorTxtUpdate(editor.getJSON());
        }

        editor.on('update', handleEditorUpdate);

        return () => editor.off('update', handleEditorUpdate)
    }, [])

    /**
     * 
     */
    useEffect(() => {
        function handleSelectionUpdate() {
            if (editor.state.selection.empty) return

            const selection = editor.state.selection

            getSelectionEvent(selection);
        }

        editor.on('selectionUpdate', handleSelectionUpdate);

        return () => editor.off('selectionUpdate', handleSelectionUpdate);
    }, [])

    return <EditorContent className ="editor" editor={editor}/>
}
