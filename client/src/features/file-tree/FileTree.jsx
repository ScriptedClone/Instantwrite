import { useRef, useContext } from "react"
import { ProjectContext } from "../work-space/context/ProjectContext"
import { getFolderRoot } from "./fileTree.js"
import FolderChildren from "./FolderChildren"
import { use } from "react"

export default function FileTree() {
    const { projectState } = useContext(ProjectContext)
    const { nodeMapRef } = projectState
    const rootIdRef = useRef(getFolderRoot(nodeMapRef.current))

    return <FolderChildren folderId={rootIdRef.current} depth={1}/> 
}

