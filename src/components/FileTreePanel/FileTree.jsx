import { useState } from "react";
import FolderChildren from "./FolderChildren"

export default function FileTree({ tree, handleTree }) {
    return(
        <div className="fileTree" onClick={handleTree} onKeyDown={handleTree}>
            <FolderChildren folderId={"0"}
                            tree={tree} 
                            depth={1}/> 
        </div>
    )
}

