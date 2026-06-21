import { useState } from "react";
import FolderChildren from "./FolderChildren"

export default function FileTree({ folderTree, handleTree }) {

    return(
        <div className="fileTree" onClick={handleTree} >
            <FolderChildren folderId={"0"}
                            folderTree={folderTree} /> 
        </div>
    )
}

