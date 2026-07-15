import FolderChildren from "./FolderChildren"

export default function FileTree({ tree }) {
    return <FolderChildren folderId={"0"} tree={tree} depth={1}/> 
}

