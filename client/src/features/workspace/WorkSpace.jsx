import { useState, useEffect, useContext, useRef} from "react";
import { ProjectContext } from "./context/ProjectContext.js";
import { storeLastActiveDoc } from "./workspace.js";
import useProject from "./hooks/useProject.jsx";
import useDocument from "./hooks/useDocument.jsx"
import AssistantPanel from "../assistant/AssistantPanel.jsx"
import EditorPanel from "../editor/EditorPanel.jsx"
import FileTreePanel from "../filetree/FileTreePanel.jsx"

export default function Workspace() {
    const { state: projectState, actions: projectActions } = useProject('dev1');
    const { loading, nodeMapRef } = projectState;
    const { updateNodeContent } = projectActions;

    const { state: docState, actions: docActions } = useDocument(null);
    const { selectedDoc, docNodeId, docName } = docState;
    const { setDoc, renameDoc } = docActions;

    /**
     * Reference to document object in Tiptap JSON format from editor.
     * 
     */
    const [editorDoc, setEditorDoc] = useState();

    /**
     * Text selection event from editor.
     * 
     */
    const [editorSelection, setEditorSelection] = useState(null);

    /** 
     * Update nodeMap on editor text update using editorDoc. 
     * 
     */
    useEffect(() => {
        if(!editorDoc || loading) return;
        updateNodeContent(docNodeId, editorDoc)
    },[editorDoc])

    /**
     * Saves selected document's id to local storage
     * get last active document on editor mount. 
     * 
     */
    useEffect(() => {
        if(docNodeId) storeLastActiveDoc(docNodeId);
    }, [docNodeId])

    /**
     * Initializes document value if previous document id exists
     * on mount to restore previously open document on editor.
     * 
     */
    useEffect(() => {
        if(loading) return;

        const prevDocId = localStorage.getItem("prevDocId");
        if(prevDocId) setDoc(prevDocId, nodeMapRef);
    }, [loading])

    /**
     * Event handler the updates document to the selected document from
     * file tree panel.
     * 
     * @param {*} id is the user selected document node's Id. 
     */
    function handleSelectedDoc(id) {
        setDoc(id, nodeMapRef)
    }

    /**
     * Updates editorDoc by tracking document changes on editor component.
     * 
     * @param {*} currentDoc 
     */
    function handleEditorTxtUpdate(currentDoc) {
        setEditorDoc(currentDoc);
    }

    /**
     * Update editor title if document renamed on file tree is the document
     * on the editor.
     *
     * @param {*} id id of node that is renamed.
     */
    function handleDocumentRename(id) {
        if(docNodeId === id) {
            renameDoc(id, nodeMapRef);
        }
    }

    /**
     * Updates selection state when use selects a text on editor.
     * 
     * @param {*} selection the selection object from Tiptap editor.
     */
    function handleEditorSelection(selection) {
        setEditorSelection(selection)
    }

    return (
        <>
            {!loading &&
                <div className="panelHolder">
                    <ProjectContext.Provider value={{ projectState, projectActions }}>
                        <FileTreePanel handleSelectedDoc={handleSelectedDoc}
                                       handleDocumentRename={handleDocumentRename}/>
                    </ProjectContext.Provider>

                    <EditorPanel selectedDoc={selectedDoc}
                                 docName={docName}
                                 handleEditorTxtUpdate={handleEditorTxtUpdate}
                                 handleSelection={handleEditorSelection}/>
                                
                    <AssistantPanel selection={editorSelection}/>
                </div>
            }
        </>
    )
}

